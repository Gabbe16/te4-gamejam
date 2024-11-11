import Skeleton from '../enemies/Skeleton.js'
import Background from '../backgrounds/Background.js'

export default class Level1 {
    constructor(game) {
        this.game = game
        // override name for each level
        this.name = 'The Skeleton Dungeon';
        this.canvasWalls = []
        this.enemies = []
        // override background for each level
        this.background = new Background(this.game)

        // override enemy timers for each level
        this.enemyTimer = 0
        // rename intervall for each level
        this.skeletonInterval = 1500
    }

    // Push enemies to game.enemies array from each level
    update(deltaTime) {
        if (this.enemyTimer > this.skeletonInterval) {
            this.game.enemies.push(new Skeleton(this.game, 246, 420))
            console.log(this.game.enemies)
            this.enemyTimer = 0
        } else {
            this.enemyTimer += deltaTime
        }
    }

    // Override Draw background for each level
    draw(context) {
        this.background.draw(context)
    }
}