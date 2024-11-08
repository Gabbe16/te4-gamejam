import Enemy from './Enemy.js'
import skeletonkingimage from './assets/sprites/SkeletonKingRightWalk.png'
import skeletonkingdeath from './assets/sprites/SkeletonKingRightDeath.png'
import skeletonkinghit from './assets/sprites/SkeletonKingRightHurt.png'

export default class SkeletonKing extends Enemy {
  constructor(game, x, y) {
    super(game)
    this.width = 48
    this.height = 55
    this.x = x
    this.y = y
    this.speed = 2
    this.lives = 3
    this.type = 'skeletonking'
    this.scoreAmount = 30
    this.damage = 2
    this.baseDamage = 2

    this.isDead = false
    this.isHit = false

    // SkeletonKing Walk Image
    const image = new Image()
    image.src = skeletonkingimage
    this.image = image

    // SkeletonKing Walk Animation
    this.frameX = 1
    this.frameY = 0
    this.maxFrame = 10
    this.fps = 20
    this.timer = 0
    this.interval = 1000 / this.fps

    //skeleton death animation
    this.deathAnimation = {
      frameY: 0,
      maxFrame: 13
    }
    //hit animation
    this.hitAnimation = {
      frameY: 0,
      maxFrame: 4
    }

    // Flip sprite if x is greater than 400
    if (this.x > 400) {
      this.flip = true
    }
  }

  update(player, secondPlayer, deltaTime) {
    // SkeletonKing Walk Animation
    if (this.speedX < 0) {
      this.flip = true
    } else if (this.speedX > 0) {
      this.flip = false
    }

    // SkeletonKing Hit Animation
    if (this.isHit) {
      this.maxFrame = this.hitAnimation.maxFrame
      this.image.src = skeletonkinghit
      if (this.frameX === this.hitAnimation.maxFrame - 1) {
        this.isHit = false
        this.image.src = skeletonkingimage
      }
    }

    // Skeleton death animation
    if (this.isDead) {
      this.damage = 0
      this.speed = 0
      this.image.src = skeletonkingdeath
      this.maxFrame = this.deathAnimation.maxFrame

      if (this.frameX === this.deathAnimation.maxFrame - 1) {
        this.markedForDeletion = true
      }
    }

    // Frame Update
    if (this.timer > this.interval) {
      this.frameX++
      this.timer = 0
    } else {
      this.timer += deltaTime
    }

    if (this.frameX >= this.maxFrame) {
      this.frameX = 0
    }

    // calculate distance between player and the skeletonKing
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

    // if distance is greater than distance2 move towards player1 else move towards player2
    if (distance > distance2) {
      this.x += speedX2
      this.y += speedY2
    } else {
      this.x += speedX
      this.y += speedY
    }
  }

  draw(context) {
    if (this.flip) {
      context.save()
      context.scale(-1, 1)
    }

    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.flip ? this.x * -1 - (this.width + 25) : this.x - 25,
      this.y - 25,
      this.width * 2,
      this.height * 2
    )

    if (this.flip) {
      context.restore()
    }

    // SkeletonKing Debugging
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
