export default class Level {
    constructor(game) {
        this.game = game
        this.player = game.player
        this.secondPlayer = game.secondPlayer
        this.audio = game.audio
        // override name for each level
        this.name = 'Level';
        // override background for each level
        this.background = null

        // override enemy timers for each level
        this.enemyTimer = 0
        this.enemyInterval = 0
    }

    // Push enemies to game.enemies array from each level
    update(deltaTime) {
        if (this.enemyTimer > this.enemyInterval) {
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