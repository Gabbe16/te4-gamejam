import necromancer from './assets/sprites/necromancerSheet.png'
import Projectile from './Projectile.js'

export default class Player {
  constructor(game) {
    this.game = game
    this.width = 80
    this.height = 110
    this.imageheight = 160 
    this.imagewidth = 128
    this.x = 1024
    this.y = 390

    this.projectiles = []

    this.speedX = 0
    this.speedY = 0
    this.maxSpeed = 3.5

    this.maxAmmo = 10
    this.ammo = 10
    this.ammoTimer = 0
    this.ammoInterval = 500

    this.lives = 10
    this.maxLives = 10

    this.shooting = false
    this.hit = true
    this.isDead = false
    this.isDeadDone = false

    // Player spritesheet image
    const image = new Image()
    image.src = necromancer
    this.image = image

    // All animations
    this.idleAnimation = {
      frameY: 0,
      maxFrame: 8
    }

    this.walkAnimation = {
      frameY: 1,
      maxFrame: 8
    }
    
    this.shootingAnimation = {
      frameY: 2,
      maxFrame: 13
    }
    this.hitAnimation = {
      frameY: 5,
      maxFrame: 5
    }
    this.deathAnimation = {
      frameY: 6,
      maxFrame: 9
    }

    // Sprite animation variables
    this.frameX = 0
    this.frameY = 0
    this.maxFrame = 0
    this.fps = 20
    this.timer = 0
    this.interval = 1000 / this.fps

    // Flip sprite
    this.flip = false
  }

  update(deltaTime) {
    if (this.lives <= 0) {
      this.game.gameOver = true
      
      this.isDead = true
    }

    // Right and left movement
    if (this.game.keys.includes('ArrowLeft')) {
      this.speedX = -this.maxSpeed
    } else if (
      this.game.keys.includes('ArrowRight')
    ) {
      this.speedX = this.maxSpeed
    } else {
      this.speedX = 0
    }

    // Up and down movement
    if (this.game.keys.includes('ArrowUp')) {
      this.speedY = -this.maxSpeed
    } else if (
      this.game.keys.includes('ArrowDown')
    ) {
      this.speedY = this.maxSpeed
    } else {
      this.speedY = 0
    }

    this.y += this.speedY
    this.x += this.speedX

    // Sprite animation
    if (this.speedX < 0) {
      this.flip = true
    } else if (this.speedX > 0) {
      this.flip = false
    }

    // Frame update
    if (this.timer > this.interval) {
      this.frameX++
      this.timer = 0
    } else {
      this.timer += deltaTime
    }

    if (this.frameX >= this.maxFrame) {
      this.frameX = 0
    }

    // Idle, walk, and shoot animations
    if (this.shooting) {
      this.maxFrame = this.shootingAnimation.maxFrame
      this.frameY = this.shootingAnimation.frameY
      if (this.frameX === this.shootingAnimation.maxFrame - 1) {
        this.shooting = false
      }
    } else if (this.speedX !== 0 || this.speedY !== 0) {
      this.maxFrame = this.walkAnimation.maxFrame
      this.frameY = this.walkAnimation.frameY
    } else {
      this.maxFrame = this.idleAnimation.maxFrame
      this.frameY = this.idleAnimation.frameY
    }

    // Death animation
    if (this.isDead) {
      if (this.isDeadDone) {
        this.frameY = 100
        this.x = -2000
        this.y = -2000
      } else {
        this.maxFrame = this.deathAnimation.maxFrame
        this.frameY = this.deathAnimation.frameY
      }
      if (this.frameX === this.deathAnimation.maxFrame - 1) {
        this.isDeadDone = true
        this.game.audio.playerDeath.play()
      }
    }

    // Hit animation
    if(this.hit){
      this.maxFrame = this.hitAnimation.maxFrame
      this.frameY = this.hitAnimation.frameY
      if(this.frameX === this.hitAnimation.maxFrame - 1){
        this.hit = false
      }
    }

    // Ammo regeneration
    if (this.ammoTimer > this.ammoInterval && this.ammo < this.maxAmmo) {
      this.ammoTimer = 0
      this.ammo++
    } else {
      this.ammoTimer += deltaTime
    }

    // Projectiles
    this.projectiles.forEach((projectile) => {
      projectile.update(deltaTime)
    })
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    )
  }

  draw(context) {
    if (this.flip) {
      context.save()
      context.scale(-1, 1)
    }

    context.drawImage(
      this.image,
      this.frameX * this.imageheight,
      this.frameY * this.imagewidth,
      this.imagewidth,
      this.imageheight,
      this.flip ? this.x * -1 - (this.width + 85) : this.x - 85,
      this.y - 100,
      this.width * 2.5,
      this.height * 2.5
    )

    if (this.flip) {
      context.restore()
    }

    // Player debugging
    if (this.game.debug) {
      context.strokeStyle = '#000'
      context.strokeRect(this.x, this.y, this.width, this.height)
      context.lineWidth = 1
      context.beginPath()
      const dx = this.game.input.mouseX - (this.x + this.width / 2)
      const dy = this.game.input.mouseY - (this.y + this.height / 2)
      const maxLength = 60
      const angle = Math.atan2(dy, dx)
      const x = this.x + this.width / 2 + maxLength * Math.cos(angle)
      const y = this.y + this.height / 2 + maxLength * Math.sin(angle)
      context.moveTo(this.x + this.width / 2, this.y + this.height / 2)
      context.lineTo(x, y)
      context.stroke()

      context.fillStyle = 'black'
      context.font = '20px Arial'
      context.fillText(this.lives, this.x, this.y - 5)
      context.font = '12px Arial'
      context.fillText(`x: ${this.x.toFixed()}`, this.x + 35, this.y - 5)
      context.fillText(`y: ${this.y.toFixed()}`, this.x + 35, this.y - 20)
    }

    this.projectiles.forEach((projectile) => {
      projectile.draw(context)
    })
  }

  shoot(mouseX, mouseY) {
    this.shooting = true
    // get angle between player and mouse
    const angle = Math.atan2(
      mouseY - (this.y + this.height / 2),
      mouseX - (this.x + this.width / 2)
    )

    if (this.ammo > 0) {
      this.ammo--
      this.projectiles.push(
        new Projectile(
          this.game,
          this.x + this.width / 2,
          this.y + this.height / 2,
          angle
        )
      )
      if(this.game.gameStart === true){
        this.game.audio.playFireSound()
      }
    } else {
      console.log('out of ammo')
    }
  }
}
