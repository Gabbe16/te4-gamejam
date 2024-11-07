import Enemy from './Enemy.js'

export default class SkeletonBoss extends Enemy {
  constructor(game, x, y) {
    super(game)
    this.width = 70
    this.height = 70
    this.x = x
    this.y = y
    this.speed = 1
    this.lives = 25
    this.type = 'SkeletonBoss'
    this.scoreAmount = 10
    this.damage = 5
}

  update(player, secondPlayer, deltaTime) {
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
    context.fillStyle = 'red'
    context.fillRect(this.x, this.y, this.width, this.height)

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