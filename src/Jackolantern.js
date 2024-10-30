import Enemy from './Enemy'
import jackoImage from './assets/sprites/jackolantern_basket.png'

export default class Jackolantern extends Enemy {
  constructor(game, x, y) {
    super(game)
    this.width = 32
    this.height = 32
    this.x = x
    this.y = y
    this.type = 'jackolantern'

    // Jack-o-lantern Image
    const image = new Image()
    image.src = jackoImage
    this.image = image
    this.frameX = 0
    this.frameY = 1
  }

  draw(context) {
    // Draw Jack-o-lantern image
    context.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height,
    )

    // Jack-o-lantern debugging
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
