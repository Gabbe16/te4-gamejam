import Level from "./Level.js";
import Wall from "../Wall.js";
import Skeleton from "../enemies/Skeleton.js";
import Skeletonking from "../enemies/SkeletonKing.js";
import AncientSkeleton from "../enemies/AncientSkeleton.js";
import SkeletonBoss from "../enemies/SkeletonBoss.js";
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
            const xcoords = [246, 905, 1560]
            let mathrandom = Math.random() * 2
            let rounded = Math.round(mathrandom)

            if (this.game.score >= 100) {
                this.game.enemies.push(new SkeletonBoss(this, 905, 124))
                this.enemyInterval = 5000000
            }

            if (Math.random() > 0.5) {
                const xcoords = [246, 905, 1560]
                let mathrandom = Math.random() * 2
                let rounded = Math.round(mathrandom)

                if (rounded === 0) {
                    this.game.enemies.push(new Skeleton(this, xcoords[rounded], 420))
                } else if (rounded === 1) {
                    this.game.enemies.push(new Skeleton(this, xcoords[rounded], 124))
                } else {
                    this.game.enemies.push(new Skeleton(this, xcoords[rounded], 420))
                }
            } else if (Math.random() < 0.45) {
                if (rounded === 0) {
                    this.game.enemies.push(new Skeletonking(this, xcoords[rounded], 420))
                } else if (rounded === 1) {
                    this.game.enemies.push(new Skeletonking(this, xcoords[rounded], 124))
                } else {
                    this.game.enemies.push(new Skeletonking(this, xcoords[rounded], 420))
                }
            } else if (Math.random() < 0.25) {
                if (rounded === 0) {
                    this.game.enemies.push(new AncientSkeleton(this, xcoords[rounded], 420))
                } else if (rounded === 1) {
                    this.game.enemies.push(new AncientSkeleton(this, xcoords[rounded], 124))
                } else {
                    this.game.enemies.push(new AncientSkeleton(this, xcoords[rounded], 420))
                }
            }
            this.enemyTimer = 0
        } else {
            this.enemyTimer += deltaTime
        }

    }

    addCanvasWalls() {
        this.game.canvasRightLeftWalls.push(new Wall(this, 75, 18, 190, 915))
        this.game.canvasRightLeftWalls.push(new Wall(this, 1580, 18, 190, 915))
        this.game.canvasTopBottomWalls.push(new Wall(this, 75, 18, 1695, 122))
        this.game.canvasTopBottomWalls.push(new Wall(this, 75, 810, 1695, 122))
    }

    draw(context) {
        this.background.draw(context)
    }
}