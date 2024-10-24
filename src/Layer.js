export default class Layer{
    constructor(game, image, width, height, speedModifier){
        this.game = game
        this.image = image
        this.width = width
        this.height = height
        this.speedModifier = speedModifier
        this.x = 0
        this.y = 0
        console.log(this.game)
        console.log(-this.game.width)

    }

    update(){
        if(this.x <= -this.game.width){
            this.x = 0
        }
        this.x -= 5 * this.speedModifier
    }

    draw(context) {
        if (this.game.debug) {
          // draw box around layer
          context.strokeStyle = 'black'
          context.strokeRect(
            this.x - 1,
            this.y - 1,
            this.width - 1,
            this.height - 1
          )
          // write layer name
          context.font = '12px Arial'
          context.fillText(
            `Layer: ${this.image.src.split('/').pop()}`,
            this.x + 400,
            this.y + 20
          )
        }
        context.drawImage(this.image, this.x, this.y, this.game.width, this.game.height)
        context.drawImage(this.image, this.x + this.width, this.y, this.game.width, this.game.height)
      }
}