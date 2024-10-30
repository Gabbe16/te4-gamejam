import InputHandler from './InputHandler.js'
import Player from './Player.js'
import UserInterface from './UserInterface.js'
import Skeleton from './Skeleton.js'
import Skeletonking from './SkeletonKing.js'
import AncientSkeleton from './AncientSkeleton.js'
import Jackolantern from './Jackolantern.js'
import Bloodvial from './Bloodvial.js'
import Background from './Background.js'
import Audio from './Audio.js'
import secondPlayer from './SecondPlayer.js'

import wall from './Wall.js'

export default class Game {
  constructor(width, height, canvasPosition) {
    this.width = width
    this.height = height
    this.canvasPosition = canvasPosition

    // Game objects
    this.input = new InputHandler(this)
    this.ui = new UserInterface(this)
    this.background = new Background(this)
    this.audio = new Audio()
    this.player = new Player(this)
    this.secondPlayer = new secondPlayer(this)

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
    this.enemyTimer = 0
    this.skeletonInterval = 1500
    this.speed = 1

    this.canvasRightWalls = [
      new wall(this, 75, 18, 190, 915),
      new wall(this, 1580, 18, 190, 915),
    ]

    this.canvasUpDownWalls = [
      new wall(this, 75, 18, 1695, 122),
      new wall(this, 75, 810, 1695, 122)
    ]
  }

  update(deltaTime) {
    // Main menu paralax background updates
    this.ui.update(deltaTime)

    if (!this.gameOver && this.gameStart === true) {
      this.gameTime += deltaTime
    }

    if (this.gameStart === true) {
      if (this.enemyTimer > this.skeletonInterval) {
        const xcoords = [246, 905, 1560]
        let mathrandom = Math.random() * 2
        let rounded = Math.round(mathrandom)

        if (Math.random() > 0.5) {
          const xcoords = [246, 905, 1560]
          let mathrandom = Math.random() * 2
          let rounded = Math.round(mathrandom)

          if (rounded === 0) {
            this.enemies.push(new Skeleton(this, xcoords[rounded], 420))
          } else if (rounded === 1) {
            this.enemies.push(new Skeleton(this, xcoords[rounded], 124))
          } else {
            this.enemies.push(new Skeleton(this, xcoords[rounded], 420))
          }
        } else if (Math.random() < 0.45) {
          if (rounded === 0) {
            this.enemies.push(new Skeletonking(this, xcoords[rounded], 420))
          } else if (rounded === 1) {
            this.enemies.push(new Skeletonking(this, xcoords[rounded], 124))
          } else {
            this.enemies.push(new Skeletonking(this, xcoords[rounded], 420))
          }
        } else if (Math.random() < 0.25) {
          if (rounded === 0) {
            this.enemies.push(new AncientSkeleton(this, xcoords[rounded], 420))
          } else if (rounded === 1) {
            this.enemies.push(new AncientSkeleton(this, xcoords[rounded], 124))
          } else {
            this.enemies.push(new AncientSkeleton(this, xcoords[rounded], 420))
          }
        }
        this.enemyTimer = 0
      } else {
        this.enemyTimer += deltaTime
      }

      this.player.update(deltaTime)
      this.secondPlayer.update(deltaTime)

      // Check collision between players enemies and drops
      this.enemies.forEach((enemy) => {
        enemy.update(this.player, this.secondPlayer, deltaTime)
        if (this.checkCollision(this.player, enemy)) {
          enemy.isDead = true
          if (enemy.damage === 1) {
            enemy.frameX = 0
            this.audio.playPlayerDamage()
          } 
          this.player.lives = this.player.lives - enemy.damage

          if (enemy.type === 'jackolantern') {
            this.player.ammo += 2
            enemy.markedForDeletion = true
          } else if (enemy.type === 'bloodvial') {
            this.player.lives += 2
            enemy.markedForDeletion = true
          } else {
            this.player.hit = true
          }
        } else if (this.checkCollision(this.secondPlayer, enemy)) {
          enemy.isDead = true
          if (enemy.damage === 1) {
            enemy.frameX = 0
            this.audio.playPlayerDamage()
          } 
          this.secondPlayer.lives = this.secondPlayer.lives - enemy.damage
          if (enemy.type === 'jackolantern') {
            this.secondPlayer.slashInterval -= 50
            enemy.markedForDeletion = true
            if (this.secondPlayer.slashInterval < 50) {
              this.secondPlayer.slashInterval = 50
            }
          } else if (enemy.type === 'bloodvial') {
            this.secondPlayer.lives += 2
            enemy.markedForDeletion = true
          } else {
            
            this.secondPlayer.hit = true
          }
        }

        // check collision between players and canvas walls
        this.canvasRightWalls.forEach((wall) => {
          if (this.checkCollision(this.player, wall)) {
            if (this.player.x < wall.x) {
              this.player.x = wall.x - this.player.width - 1
            } else if (this.player.x > wall.x) {
              this.player.x = wall.x + wall.width + 1
            }
          } else if (this.checkCollision(this.secondPlayer, wall)) {
            if (this.secondPlayer.x < wall.x) {
              this.secondPlayer.x = wall.x - this.secondPlayer.width - 1
            } else if (this.secondPlayer.x > wall.x) {
              this.secondPlayer.x = wall.x + wall.width + 1
            }
          }
        })

        this.canvasUpDownWalls.forEach((wall) => {
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


        // Check collision between player projectiles and enemies
        this.player.projectiles.forEach((projectile) => {
          if (this.checkProjectileCollision(projectile, enemy)) {
            if (enemy.lives > 1) {
              enemy.lives -= projectile.damage
              /* enemy.frameX = 1 */
              enemy.isHit = true
              if (enemy.type === 'skeleton') {
                this.audio.playDamage1()
              } else if (enemy.type === 'skeletonking') {
                this.audio.playDamage2()
              } else if (enemy.type === 'ancientskeleton') {
                this.audio.playDamage3()
              }
            } else if (enemy.type === 'skeleton' || enemy.type === 'skeletonking' || enemy.type === 'ancientskeleton') {
              if (Math.random() > 0.45) {
                this.enemies.push(new Bloodvial(this, enemy.x, enemy.y))
              } else if (Math.random() < 0.25) {
                this.enemies.push(new Jackolantern(this, enemy.x, enemy.y))
              }
              enemy.isDead = true
              if (enemy.damage === 1) {
                enemy.frameX = 0
              } else {
                this.score += enemy.scoreAmount
              };
              
            }
            if (enemy.type === 'skeleton' || enemy.type === 'skeletonking' || enemy.type === 'ancientskeleton') {
              projectile.markedForDeletion = true
            }

          }
        })


        // Check collision between player slashes and enemies
        this.secondPlayer.slashes.forEach((slash) => {
          if (this.checkCollision(slash, enemy)) {
            if (enemy.lives > slash.damage) {
              enemy.lives -= slash.damage
              enemy.isHit = true
              if (enemy.type === 'skeleton') {
                this.audio.playDamage1()
              } else if (enemy.type === 'skeletonking') {
                this.audio.playDamage2()
              } else if (enemy.type === 'ancientskeleton') {
                this.audio.playDamage3()
              }
            } else if (enemy.type === 'skeleton' || enemy.type === 'skeletonking' || enemy.type === 'ancientskeleton') {
              if (Math.random() > 0.45) {
                this.enemies.push(new Bloodvial(this, enemy.x, enemy.y))
              } else if (Math.random() < 0.25) {
                this.enemies.push(new Jackolantern(this, enemy.x, enemy.y))
              }
              if (enemy.type === 'skeleton') {
                this.audio.playDamage1()
              } else if (enemy.type === 'skeletonking') {
                this.audio.playDamage2()
              } else if (enemy.type === 'ancientskeleton') {
                this.audio.playDamage3()
              }
              enemy.isDead = true
              if (enemy.damage === 1) {
                enemy.frameX = 0
              } else {
                this.score += enemy.scoreAmount
              };
            }
            if (enemy.type === 'skeleton' || enemy.type === 'skeletonking' || enemy.type === 'ancientskeleton') {
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
      this.background.draw(context)
      this.player.draw(context)
      this.secondPlayer.draw(context)
      this.enemies.forEach((enemy) => {
        enemy.draw(context)
      })
      this.canvasRightWalls.forEach((wall) => {
        wall.draw(context)
      })
      this.canvasUpDownWalls.forEach((wall) => {
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