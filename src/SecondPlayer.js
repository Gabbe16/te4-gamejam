import nightBorne from './assets/sprites/NightBorne.png'
import Slash from './Slash'

export default class SecondPlayer {
  constructor(game) {
    this.game = game
    this.width = 80
    this.height = 80
    this.imageheight = 80
    this.imagewidth = 80
    this.x = 740
    this.y = 405

    this.slashes = []
    this.slashTimer = 0
    this.slashInterval = 350

    this.speedX = 0
    this.speedY = 0
    this.maxSpeed = 6

    this.lives = 10
    this.maxLives = 10

    this.shooting = false
    this.hit = true
    this.isDead = false
    this.isDeadDone = false

    // Player spritesheet image
    const image = new Image()
    image.src = nightBorne
    this.image = image

    // All animations
    this.idleAnimation = {
      frameY: 0,
      maxFrame: 9
    }

    this.walkAnimation = {
      frameY: 1,
      maxFrame: 6
    }

    this.shootingAnimation = {
      frameY: 2,
      maxFrame: 12
    }
    this.hitAnimation = {
      frameY: 3,
      maxFrame: 5
    }
    this.deathAnimation = {
      frameY: 4,
      maxFrame: 16
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

    // Player2 death
    if (this.lives <= 0) {
      this.game.gameOver = true
      this.game.audio.playerDeath.play()
      this.isDead = true
    }

    // Player2 slashing
    if (this.beginSlashing) {
      if (this.slashTimer > this.slashInterval) {
        this.game.audio.playMeleeAttack()
        this.Slash()
        this.slashTimer = 0
        this.beginSlashing = false
      } else {

        this.slashTimer += deltaTime
      }
    }

    // Right and left movement
    if (this.game.keys.includes('a')) {
      this.speedX = -this.maxSpeed
    } else if (
      this.game.keys.includes('d')
    ) {
      this.speedX = this.maxSpeed
    } else {
      this.speedX = 0
    }

    // Up and down movement
    if (this.game.keys.includes('w')) {
      this.speedY = -this.maxSpeed
    } else if (

      this.game.keys.includes('s')
    ) {
      this.speedY = this.maxSpeed
    } else {
      this.speedY = 0
    }

    this.y += this.speedY
    this.x += this.speedX

    // Sprite flipping
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
      }
    }

    // Hit animation
    if (this.hit) {
      this.maxFrame = this.hitAnimation.maxFrame
      this.frameY = this.hitAnimation.frameY
      if (this.frameX === this.hitAnimation.maxFrame - 1) {
        this.hit = false
      }
    }

    // Slash update
    this.slashes.forEach((slash) => {
      slash.update(deltaTime)
    })
    this.slashes = this.slashes.filter(
      (slash) => !slash.markedForDeletion
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
      this.flip ? this.x * -1 - (this.width + 60) : this.x - 60,
      this.y - 85,
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

    this.slashes.forEach((slash) => {
      slash.draw(context)
    })
  }

  SlashInitiate() {
    if (this.shooting === false) {
      this.beginSlashing = true
      this.shooting = true
    }
  }

  Slash() {
    this.slashes.push(
      new Slash(
        this.game,
        this.x,
        this.y,
        this.flip
      )
    )
  }
}