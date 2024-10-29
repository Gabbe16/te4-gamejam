import fireballImage from './assets/sprites/FB001.png'

export default class Slash {
  constructor(game, x, y, flip) {
    this.game = game
    this.width = 50
    this.height = 100
    this.x = x + 60
    this.y = y

    this.timer = 0
    this.timeThreshold = 150
    this.angle = 0



    this.damage = 5
    this.markedForDeletion = false

    // Arrow sprite image
    const image = new Image()
    image.src = fireballImage
    this.image = image

    console.log(flip)

    this.flip = flip

    if (flip) {
      this.x -= 100
    }
  }

  update(deltaTime) {

    this.timer += deltaTime
    if (this.timer > this.timeThreshold) {
      this.markedForDeletion = true
    }



  }

  draw(context) {

    if (this.flip) {
      context.save()
      context.scale(-1, 1)
    }

    context.drawImage(
      this.image,
      this.flip ? this.x * -1 - (this.width) : this.x,
      this.y,
      this.width,
      this.height,
    )
    context.strokeRect(this.x, this.y, this.width, this.height)
    context.lineWidth = 1

    if (this.flip) {
      context.restore()
    }
  }
}
