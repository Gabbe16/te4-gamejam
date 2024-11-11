import Level from "./Level.js";
import Wall from "../Wall.js";

import Background from "../backgrounds/Background.js";

export default class Level1 extends Level {
    constructor(game) {
        super(game)
        this.name = 'The Skeleton Dungeon';
        this.background = new Background(this.game)
        this.enemyInterval = 1500
        this.wallInterval = 10
        this.wallTimer = 10
    }

    update(deltaTime) {
        // Add walls to canvas
        if (this.wallTimer > this.wallInterval) {
            this.addCanvasWalls()
            this.wallTimer = 0
            this.wallInterval = 5000000
        } else {
            this.wallTimer += deltaTime
        }

        // Add enemies to game.enemies array
        if (this.enemyTimer > this.enemyInterval) {
            this.enemyTimer = 0
        } else {
            this.enemyTimer += deltaTime
        }
    }

    addCanvasWalls() {
        // this.game.canvasRightLeftWalls.push(new Wall(this, ))
        // this.game.canvasRightLeftWalls.push(new Wall(this, ))
        // this.game.canvasTopBottomWalls.push(new Wall(this, )
        // this.game.canvasTopBottomWalls.push(new Wall(this, ))
    }

    draw(context) {
        // this.background.draw(context)
    }
}