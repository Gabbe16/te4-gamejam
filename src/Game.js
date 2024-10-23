import InputHandler from './InputHandler.js'
import Player from './Player.js'
import UserInterface from './UserInterface.js'
import Pumpkin from './Skeleton.js'
import Candy from './Jackolantern.js'
import Background from './Background.js'
import Audio from './Audio.js'

export default class Game {
  constructor(width, height, canvasPosition) {
    this.width = width
    this.height = height
    this.canvasPosition = canvasPosition

    this.input = new InputHandler(this)
    this.ui = new UserInterface(this)
    this.background = new Background(this)
    this.audio = new Audio()
    this.player = new Player(this)

    this.keys = []
    this.enemies = []
    this.enemies = []
    this.gameOver = false
    this.debug = false
    this.gameTime = 0
    this.enemyTimer = 0
    this.enemyInterval = 1000
  }

  update(deltaTime) {
    if (!this.gameOver) {
      this.gameTime += deltaTime
    }

    if (this.enemyTimer > this.enemyInterval) {
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
        this.enemies.push(new Pumpkin(this, x, y))
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
        if (this.checkCollision(projectile, enemy)) {
          if (enemy.lives > 1) {
            enemy.lives -= projectile.damage
          } else if (enemy.type === 'skeleton') {
           this.enemies.push(new Candy(this, enemy.x, enemy.y))
           enemy.markedForDeletion = true
          }
          if (enemy.type === 'skeleton') {
            projectile.markedForDeletion = true
          }
          
        }
      })
    })
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion)
  }

  draw(context) {
    this.background.draw(context)
    this.ui.draw(context)
    this.player.draw(context)
    this.enemies.forEach((enemy) => {
      enemy.draw(context)
    })
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
