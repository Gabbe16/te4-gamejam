import Enemy from './Enemy.js'
import luciferSkeleton from './assets/sprites/SkeletonWithSwordRightRun.png'

export default class Skeleton extends Enemy {
  constructor(game, x, y) {
    super(game)
    this.width = 48
    this.height = 55
    this.x = x
    this.y = y
    this.speed = 2
    this.lives = Math.floor(Math.random() * 1) + 1
    this.type = 'skeleton'
    this.scoreAmount = 10

    // Skeleton Walk Image
    const image = new Image()
    image.src = luciferSkeleton
    this.image = image

    // Skeleton Walk Animation
    this.frameX = 1
    this.frameY = 0
    this.maxFrame = 6
    this.fps = 20
    this.timer = 0
    this.interval = 1000 / this.fps

    // Flip sprite if x is greater than 400
    if (this.x > 400) {
      this.flip = true
    }
  }

  update(player, secondPlayer, deltaTime) {
    // Skeleton Walk Animation
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

    const dx = player.x - this.x // calculate the x distance to the player
    const dy = player.y - this.y // calculate the y distance to the player
    const dx2 = secondPlayer.x - this.x // calculate the x distance to the player
    const dy2 = secondPlayer.y - this.y // calculate the y distance to the player
    const distance = Math.sqrt(dx * dx + dy * dy) // calculate the total distance to the player
    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) // calculate the total distance to the player

    const speedX = (dx / distance) * this.speed // calculate the x speed towards the player
    const speedY = (dy / distance) * this.speed // calculate the y speed towards the player
    const speedX2 = (dx2 / distance2) * this.speed // calculate the x speed towards the player
    const speedY2 = (dy2 / distance2) * this.speed // calculate the y speed towards the player


    // if  distance is greater than distance2 move towards player else move towards second player
    if (distance > distance2) {
      this.x += speedX2 // move the enemy towards the player on the x axis
      this.y += speedY2 // move the enemy towards the player on the y axis
    } else {
      this.x += speedX // move the enemy towards the player on the x axis
      this.y += speedY // move the enemy towards the player on the y axis
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
