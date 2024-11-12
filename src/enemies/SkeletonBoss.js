import Enemy from './Enemy.js'
import skeletonBoss from '../assets/sprites/skeletonBoss.png'

export default class SkeletonBoss extends Enemy {
  constructor(game, x, y) {
    super(game)
    this.width = 64
    this.height = 64
    this.imageheight = 64
    this.imagewidth = 64
    this.x = x
    this.y = y
    this.speed = 1
    this.lives = 25
    this.type = 'SkeletonBoss'
    this.scoreAmount = 10
    this.damage = 5
    this.baseDamage = 5


    this.isDead = false
    this.isHit = false
    this.attackPlayer1 = false
    this.attackDone = false
    this.attackBegin = false
    this.attackPlayer2 = false
    this.attackDone2 = false
    this.attackBegin2 = false

    // SkeletonBoss sprite sheet
    const image = new Image()
    image.src = skeletonBoss
    this.image = image

    this.walkAnimation = {
      frameY: 2,
      maxFrame: 12
    }
    this.attackAnimation = {
      frameY: 0,
      maxFrame: 13
    }
    this.hitAnimation = {
      frameY: 4,
      maxFrame: 3
    }
    this.deathAnimation = {
      frameY: 1,
      maxFrame: 13
    }

    // Sprite animation variables
    this.frameX = 0
    this.frameY = 2
    this.maxFrame = 12
    this.fps = 20
    this.timer = 0
    this.interval = 1000 / this.fps

    // Flip sprite
    this.flip = false
  }

  update(player, secondPlayer, deltaTime) {
    console.log(this.lives)

    if (this.attackPlayer1 && !this.isDead) {
      if (this.attackBegin === false) {
        this.attackBegin = true
        this.frameX = 0
      }

      this.frameY = this.attackAnimation.frameY
      this.maxFrame = this.attackAnimation.maxFrame
      if (this.frameX === 6 && !this.attackDone) {
        this.game.player.lives -= this.damage
        this.game.audio.playPlayerDamage()
        this.attackDone = true
      }

      if (this.frameX === this.attackAnimation.maxFrame - 1) {
        this.attackPlayer1 = false
        this.attackDone = false
        this.attackBegin = false
        this.frameX = 0
        this.frameY = this.walkAnimation.frameY
        this.maxFrame = this.walkAnimation.maxFrame

      }
    }
    if (this.attackPlayer2  && !this.isDead) {
      if (this.attackBegin2 === false) {
        this.attackBegin2 = true
        this.frameX = 0
      }
      this.frameY = this.attackAnimation.frameY
      this.maxFrame = this.attackAnimation.maxFrame
      if (this.frameX === 6 && !this.attackDone2) {
        this.game.secondPlayer.lives -= this.damage
        this.game.audio.playPlayerDamage()
        this.attackDone2 = true
      }

      if (this.frameX === this.attackAnimation.maxFrame - 1) {
        this.attackPlayer2 = false
        this.attackDone2 = false
        this.attackBegin2 = false
        this.frameX = 0
        this.frameY = this.walkAnimation.frameY
        this.maxFrame = this.walkAnimation.maxFrame

      }
    }

    if (this.isHit && !this.isDead) {
      this.frameY = this.hitAnimation.frameY
      this.maxFrame = this.hitAnimation.maxFrame
      if (this.frameX === this.hitAnimation.maxFrame - 1) {
        this.isHit = false
        this.frameX = 0
        this.frameY = this.walkAnimation.frameY
        this.maxFrame = this.walkAnimation.maxFrame
      }
    }
    if (this.isDead) {
      this.damage = 0
      this.speed = 0
      this.frameY = this.deathAnimation.frameY
      this.maxFrame = this.deathAnimation.maxFrame

      if (this.frameX === this.deathAnimation.maxFrame - 1) {
        this.markedForDeletion = true
      }
    }


    if (this.timer > this.interval) {
      this.frameX++
      this.timer = 0
    } else {
      this.timer += deltaTime
    }

    if (this.frameX >= this.maxFrame) {
      this.frameX = 0
    }
    // calculate distance between player and the skeleton boss
    const dx = player.x - this.x
    const dy = player.y - this.y
    const dx2 = secondPlayer.x - this.x
    const dy2 = secondPlayer.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

    const speedX = (dx / distance) * this.speed
    const speedY = (dy / distance) * this.speed
    const speedX2 = (dx2 / distance2) * this.speed
    const speedY2 = (dy2 / distance2) * this.speed



    // if  distance is greater than distance2 move towards player else move towards second player
    if (distance > distance2) {
      this.x += speedX2
      this.y += speedY2
      if (speedX2 < 0) {
        this.flip = true

      } else {
        this.flip = false
      }
    } else {
      this.x += speedX
      this.y += speedY
      if (speedX < 0) {
        this.flip = true
      } else {
        this.flip = false
      }
    }

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
      this.flip ? this.x * -1 - (this.width + 50) : this.x - 50,
      this.y - 50,
      this.width * 2.5,
      this.height * 2.5
    )

    if (this.flip) {
      context.restore()
    }
    // Skeleton Debugging
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height)
      context.fillStyle = 'black'
      context.font = '20px Arial'
      context.fillText(this.lives, this.x, this.y - 5)
      context.font = '12px Arial'
      context.fillText(`x: ${this.x.toFixed()}`, this.x + 20, this.y - 5)
      context.fillText(`y: ${this.y.toFixed()}`, this.x + 20, this.y - 20)
    }
  }

}