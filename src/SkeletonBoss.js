import Enemy from './Enemy.js'
import skeletonBoss from './assets/sprites/skeletonBoss.png'

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

    // SkeletonBoss sprite sheet
    const image = new Image()
    image.src = skeletonBoss
    this.image = image

    this.walkAnimation = {
      frameY: 2,
      maxFrame: 12
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
    // SkeletonKing Walk Animation
    if (this.speedX < 0) {
      this.flip = true
    } else if (this.speedX > 0) {
      this.flip = false
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
    } else {
      this.x += speedX
      this.y += speedY
    }
  }

  draw(context) {
  

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