import fireballImage from './assets/sprites/FB001.png'

export default class Slash {
  constructor(game, x, y, flip) {
    this.game = game
    this.width = 180
    this.height = 180
    this.x = x 
    this.y = y 

    this.timer = 0
    this.timeThreshold = 400
    this.angle = 0



    this.damage = 100
    this.markedForDeletion = false

    // Arrow sprite image
    const image = new Image()
    image.src = fireballImage
    this.image = image

    console.log(flip)

    this.flip = flip

  
  }

  update(deltaTime) {

    this.timer += deltaTime
    if (this.timer > this.timeThreshold) {
      this.markedForDeletion = true
    }
    if (this.flip) {
      this.x = this.game.secondPlayer.x - 80
      this.y = this.game.secondPlayer.y - 75
    } else {
      this.x = this.game.secondPlayer.x - 20
    this.y = this.game.secondPlayer.y -75

    }

  }

  draw(context) {

    
    if(this.game.debug){
      context.strokeRect(this.x, this.y, this.width, this.height)
    }

   /*  context.drawImage(
      this.image,
      this.flip ? this.x * -1 - (this.width) : this.x,
      this.y,
      this.width,
      this.height,
    )
    context.strokeRect(this.x, this.y, this.width, this.height)
    context.lineWidth = 1
 */
    
  }
}
