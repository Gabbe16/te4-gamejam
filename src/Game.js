import InputHandler from './InputHandler.js'
import Player from './Player.js'
import UserInterface from './UserInterface.js'
import Skeleton from './Skeleton.js'
import Candy from './Jackolantern.js'
import Background from './Background.js'
import Audio from './Audio.js'

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

    // Game states
    this.gameStart = false
    this.mainMenu = true
    this.viewControls = false
    this.viewCredits = false

    // Game variables
    this.score = 0
    this.keys = []
    this.enemies = []
    this.gameOver = false
    this.debug = false
    this.menuTime = 0
    this.gameTime = 0
    this.enemyTimer = 0
    this.skeletonInterval = 1500
    this.speed = 1
  }

  update(deltaTime) {
    // Main menu paralax background updates
    this.ui.update(deltaTime)

    if (!this.gameOver && this.gameStart === true) {
      this.gameTime += deltaTime
    }

    if (this.gameStart === true){
      if (this.enemyTimer > this.skeletonInterval) {
        // Left door point
        // let x1 = 246
        // let y1 = 420

        // Top middle door point
        // let x2 = 905
        // let y2 = 124

        // Right door point
        // let x3 = 1560
        // let y3 = 420

        let x = Math.random() < 0.5 ? 0 : this.width // spawn on left or right edge
        let y = Math.random() < 0.5 ? 0 : this.height // spawn on top or bottom edge
        if (x === 0) {
          y = Math.random() * this.height // if on left edge, randomize y position
        } else if (x === this.width) {
          y = Math.random() * this.height // if on right edge, randomize y position
        } else if (y === 0) {
          x = Math.random() * this.width // if on top edge, randomize x position
        } else {
          x = Math.random() * this.width // if on bottom edge, randomize x position
        }
        if (Math.random() < 0.2) {
          // this.enemies.push(new Candy(this, x, y))
        } else {
          this.enemies.push(new Skeleton(this, x, y))
        }
        this.enemyTimer = 0
      } else {
        this.enemyTimer += deltaTime
      }
      this.player.update(deltaTime)
  
      // Check collision between player, enemies drops (candy)
      this.enemies.forEach((enemy) => {
        enemy.update(this.player, deltaTime)
        if (this.checkCollision(this.player, enemy)) {
          this.player.lives--
          enemy.markedForDeletion = true
          if (enemy.type === 'drops') {
            this.player.ammo += 5
            this.player.lives += 1
          }
        }
  
        // Check collision between player projectiles and enemies
        this.player.projectiles.forEach((projectile) => {
          if (this.checkProjectileCollision(projectile, enemy)) {
            if (enemy.lives > 1) {
              enemy.lives -= projectile.damage
            } else if (enemy.type === 'skeleton') {
             this.enemies.push(new Candy(this, enemy.x, enemy.y))
             enemy.markedForDeletion = true
             this.score += enemy.scoreAmount
            }
            if (enemy.type === 'skeleton') {
              projectile.markedForDeletion = true
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
      this.enemies.forEach((enemy) => {
        enemy.draw(context)
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