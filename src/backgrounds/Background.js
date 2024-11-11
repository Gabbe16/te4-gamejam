import dungeonBackground from './assets/sprites/dungeon.png';

export default class Background {
    constructor(game) {
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.x = 0;
        this.y = 0;
    
        // Background image
        const image = new Image();
        image.src = dungeonBackground;
        this.image = image;
    }
    
    draw(context) {
        // Draw background image
        context.drawImage(
        this.image,
        this.x,
        this.y,
        this.width,
        this.height,
        );
    }
}
