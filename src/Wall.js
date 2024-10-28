export default class Wall {
    constructor(game, x, y, width, height) {
        this.game = game
        this.width = width
        this.height = height
        this.x = x
        this.y = y
    }

    draw(context) {
        context.fillStyle = 'transparent'
        context.fillRect(this.x, this.y, this.width, this.height)

        if (this.game.debug) {
            context.strokeStyle = 'red'
            context.strokeRect(this.x, this.y, this.width, this.height)
        }
    }
}
