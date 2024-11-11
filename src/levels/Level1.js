import Level from "./level";
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
    }

    update(deltaTime) {
        if (this.enemyTimer > this.enemyInterval) {
            const xcoords = [246, 905, 1560]
            let mathrandom = Math.random() * 2
            let rounded = Math.round(mathrandom)

            if (this.score >= 100) {
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

    draw(context) {
        this.background.draw(context)
    }
}