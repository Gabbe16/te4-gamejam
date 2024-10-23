import arrowImage from './assets/sprites/projectile.png'

export default class Projectile {
  constructor(game, x, y, angle) {
    this.game = game
    this.width = 40
    this.height = 5
    this.x = x
    this.y = y
    this.angle = angle

    this.speed = 400
    this.damage = 1
    this.markedForDeletion = false

    // Arrow sprite image
    const image = new Image()
    image.src = arrowImage
    this.image = image
  }

  update(deltaTime) {
    const velocity = {
      x: this.speed * Math.cos(this.angle),
      y: this.speed * Math.sin(this.angle),
    }

    this.x += velocity.x * (deltaTime / 1000)
    this.y += velocity.y * (deltaTime / 1000)

    if (this.x > this.game.width) {
      this.markedForDeletion = true
    }
  }

  draw(context) {
    // Draw arrow image and rotate it based on its angle
    context.save()
    context.translate(this.x, this.y)
    context.rotate(this.angle)

    context.drawImage(
      this.image,
      0,
      0,
      this.width,
      this.height,
    )

    context.restore()

    // Projectile Debugging
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height)
      context.fillStyle = 'black'
      context.font = '20px Arial'
      context.font = '12px Arial'
      context.fillText(`x: ${this.x.toFixed()}`, this.x + 20, this.y - 5)
      context.fillText(`y: ${this.y.toFixed()}`, this.x + 20, this.y - 20)
    }
  }
}
