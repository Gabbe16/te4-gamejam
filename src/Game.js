import InputHandler from './InputHandler.js'
import Player from './Player.js'
import UserInterface from './UserInterface.js'
import Level1 from './levels/Level1.js'
import Level2 from './levels/Level2.js'
import Jackolantern from './drops/Jackolantern.js'
import Bloodvial from './drops/Bloodvial.js'
import Audio from './Audio.js'
import secondPlayer from './SecondPlayer.js'

export default class Game {
  constructor(width, height, canvasPosition) {
    this.width = width
    this.height = height
    this.canvasPosition = canvasPosition

    // Game objects
    this.input = new InputHandler(this)
    this.ui = new UserInterface(this)
    this.audio = new Audio(this)
    this.player = new Player(this)
    this.secondPlayer = new secondPlayer(this)
    this.Level1 = new Level1(this, this.player, this.secondPlayer, this.audio)
    this.Level2 = new Level2(this, this.player, this.secondPlayer, this.audio)

    // Game states
    this.gameStart = false
    this.mainMenu = true
    this.viewControls = false
    this.viewCredits = false
    this.gameOver = false
    this.debug = false

    // Game variables
    this.score = 0
    this.keys = []
    this.enemies = []
    this.menuTime = 0
    this.gameTime = 0
    this.speed = 1

    // Levels
    this.currentLevel = 0
    this.levels = []
    this.doors = []
    this.levels.push(this.Level1)
    this.levels.push(this.Level2)

    // Level canvas hitboxes
    this.canvasRightLeftWalls = []
    this.canvasTopBottomWalls = []
  }

  update(deltaTime) {
    // Main menu paralax background updates
    this.ui.update(deltaTime)

    if (!this.gameOver && this.gameStart === true) {
      this.gameTime += deltaTime
    }

    if (this.gameStart === true) {
      this.levels[this.currentLevel].update(deltaTime)
      this.player.update(deltaTime)
      this.secondPlayer.update(deltaTime)

      // Check collision between players and doors for the next level
      this.doors.forEach((door) => {
        if (this.checkCollision(this.player, door)) {
          this.currentLevel += 1
          this.player.x = 1024
          this.player.y = 390
          this.secondPlayer.x = 740
          this.secondPlayer.y = 405
          this.doors = []
        } else if (this.checkCollision(this.secondPlayer, door)) {
          this.currentLevel += 1
          this.player.x = 1024
          this.player.y = 390
          this.secondPlayer.x = 740
          this.secondPlayer.y = 405
          this.doors = []
        }
      })

      // check collision between players and the canvas walls
      this.canvasRightLeftWalls.forEach((wall) => {
        if (this.checkCollision(this.player, wall)) {
          if (this.player.x < wall.x) {
            this.player.x = wall.x - this.player.width - 1
            this.currentLevel = 1
          } else if (this.player.x > wall.x) {
            this.player.x = wall.x + wall.width + 1
          }
        } else if (this.checkCollision(this.secondPlayer, wall)) {
          if (this.secondPlayer.x < wall.x) {
            this.secondPlayer.x = wall.x - this.secondPlayer.width - 1
            this.currentLevel = 1
          } else if (this.secondPlayer.x > wall.x) {
            this.secondPlayer.x = wall.x + wall.width + 1
          }
        }
      })

      this.canvasTopBottomWalls.forEach((wall) => {
        if (this.checkCollision(this.player, wall)) {
          if (this.player.y < wall.y) {
            this.player.y = wall.y - this.player.height - 1
          } else if (this.player.y > wall.y) {
            this.player.y = wall.y + wall.height + 1
          }
        } else if (this.checkCollision(this.secondPlayer, wall)) {
          if (this.secondPlayer.y < wall.y) {
            this.secondPlayer.y = wall.y - this.secondPlayer.height - 1
          } else if (this.secondPlayer.y > wall.y) {
            this.secondPlayer.y = wall.y + wall.height + 1
          }
        }
      })

      // Check collision between players enemies and drops
      this.enemies.forEach((enemy) => {
        enemy.update(this.player, this.secondPlayer, deltaTime)
        if (this.checkCollision(this.player, enemy)) {
          /* enemy.isDead = true */
          
          if (enemy.type === 'jackolantern') {
            this.player.ammo += 2
            enemy.markedForDeletion = true
            console.log('jackolantern')
          } else if (enemy.type === 'bloodvial' && this.player.lives < this.player.maxLives) {
            this.player.lives += 1
            enemy.markedForDeletion = true
            console.log('bloodvial')
          
          } else if (enemy.type === 'skeleton' || enemy.type === 'skeletonking' || enemy.type === 'ancientskeleton' || enemy.type === 'SkeletonBoss') {
            enemy.attackPlayer1 = true
            this.player.hit = true
          }
        } else if (this.checkCollision(this.secondPlayer, enemy)) {
          /* enemy.isDead = true */
          if (enemy.type === 'jackolantern') {
            this.secondPlayer.slashInterval -= 50
            enemy.markedForDeletion = true
            if (this.secondPlayer.slashInterval < 50) {
              this.secondPlayer.slashInterval = 50
            }
          } else if (enemy.type === 'bloodvial' && this.secondPlayer.lives < this.secondPlayer.maxLives) {
            this.secondPlayer.lives += 1
            enemy.markedForDeletion = true
          } else {
            enemy.attackPlayer2 = true

            this.secondPlayer.hit = true
          }
        }

        // Check collision between player projectiles and enemies
        this.player.projectiles.forEach((projectile) => {
          if (this.checkProjectileCollision(projectile, enemy)) {
            if (enemy.lives > 1) {
              enemy.lives -= projectile.damage
              enemy.frameX = 0
              enemy.isHit = true
              if (enemy.type === 'skeleton') {
                this.audio.playDamage1()
              } else if (enemy.type === 'skeletonking') {
                this.audio.playDamage2()
              } else if (enemy.type === 'ancientskeleton') {
                this.audio.playDamage3()
              }
            } else if (enemy.type === 'skeleton' || enemy.type === 'skeletonking' || enemy.type === 'ancientskeleton' || enemy.type === 'SkeletonBoss') {
              if (enemy.type === 'skeleton') {
                this.audio.playDamage1()
                if (Math.random() < 0.15) {
                  this.enemies.push(new Bloodvial(this, enemy.x, enemy.y))
                }
              } else if (enemy.type === 'skeletonking') {
                this.audio.playDamage2()
                if (Math.random() < 0.25) {
                  this.enemies.push(new Bloodvial(this, enemy.x, enemy.y))
                }
              } else if (enemy.type === 'ancientskeleton') {
                this.audio.playDamage3()
                if (Math.random() < 0.15) {
                  this.enemies.push(new Jackolantern(this, enemy.x, enemy.y))
                }
              }

              enemy.isDead = true
              if (enemy.damage === enemy.baseDamage) {
                enemy.frameX = 0
                this.score += enemy.scoreAmount
              }
              
            }
            if(enemy.damage === 1){
              projectile.markedForDeletion = true
            }
            if (enemy.type === 'skeleton' || enemy.type === 'skeletonking' || enemy.type === 'ancientskeleton' || enemy.type === 'SkeletonBoss') {
              if(!enemy.isDead){
                
                projectile.markedForDeletion = true
              }
            }

          }
        })

        // Check collision between player slashes and enemies
        this.secondPlayer.slashes.forEach((slash) => {
          if (this.checkCollision(slash, enemy)) {
            if (enemy.lives > slash.damage) {
              enemy.lives -= slash.damage
              enemy.frameX = 0
              enemy.isHit = true
              if (enemy.type === 'skeleton') {
                this.audio.playDamage1()
              } else if (enemy.type === 'skeletonking') {
                this.audio.playDamage2()
              } else if (enemy.type === 'ancientskeleton') {
                this.audio.playDamage3()
              }
            } else if (enemy.type === 'skeleton' || enemy.type === 'skeletonking' || enemy.type === 'ancientskeleton' || enemy.type === 'SkeletonBoss') {
              if (enemy.type === 'skeleton') {
                this.audio.playDamage1()
                if (Math.random() < 0.15) {
                  this.enemies.push(new Bloodvial(this, enemy.x, enemy.y))
                }
              } else if (enemy.type === 'skeletonking') {
                this.audio.playDamage2()
                if (Math.random() < 0.25) {
                  this.enemies.push(new Bloodvial(this, enemy.x, enemy.y))
                }
              } else if (enemy.type === 'ancientskeleton') {
                this.audio.playDamage3()
                if (Math.random() < 0.15) {
                  this.enemies.push(new Jackolantern(this, enemy.x, enemy.y))
                }
              }
              enemy.isDead = true
              if (enemy.damage === enemy.baseDamage) {
                enemy.frameX = 0
                this.score += enemy.scoreAmount
              }
            }
            if (enemy.type === 'skeleton' || enemy.type === 'skeletonking' || enemy.type === 'ancientskeleton' || enemy.type === 'SkeletonBoss') {
             
              slash.markedForDeletion = true

            }

          }
        })
      })
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion)
    }
  }

  draw(context) {
    if (this.gameStart === true) {
      this.levels[this.currentLevel].draw(context)
      this.player.draw(context)
      this.secondPlayer.draw(context)
      this.enemies.forEach((enemy) => {
        enemy.draw(context)
      })
      this.canvasRightLeftWalls.forEach((wall) => {
        wall.draw(context)
      })
      this.canvasTopBottomWalls.forEach((wall) => {
        wall.draw(context)
      })
    }
    this.ui.draw(context)
  }

  checkProjectileCollision(projectile, object) {
    let angle = projectile.angle;
    let dx1 = projectile.width * Math.cos(angle);
    let dy1 = projectile.width * Math.sin(angle);
    let dx2 = projectile.height * -Math.sin(angle);
    let dy2 = projectile.height * Math.cos(angle);
    let x1 = projectile.x + dx1;
    let y1 = projectile.y + dy1;

    if (
      x1 > object.x &&
      x1 < object.x + object.width &&
      y1 > object.y &&
      y1 < object.y + object.height
    ) {
      return true;
    }

    let x2 = x1 + dx2;
    let y2 = y1 + dy2;

    if (
      x2 > object.x &&
      x2 < object.x + object.width &&
      y2 > object.y &&
      y2 < object.y + object.height
    ) {
      return true;
    }

    let x3 = x2 - dx1;
    let y3 = y2 - dy1;

    if (
      x3 > object.x &&
      x3 < object.x + object.width &&
      y3 > object.y &&
      y3 < object.y + object.height
    ) {
      return true;
    }

    if (
      projectile.x > object.x &&
      projectile.x < object.x + object.width &&
      projectile.y > object.y &&
      projectile.y < object.y + object.height
    ) {
      return true;
    }
  }

  checkCollision(object1, object2) {
    return (
      object1.x < object2.x + object2.width &&
      object1.x + object1.width > object2.x &&
      object1.y < object2.y + object2.height &&
      object1.height + object1.y > object2.y
    )
  }
}