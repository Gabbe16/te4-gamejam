import backgroundMusicURL from './assets/sounds/backgroundMusic.mp3';

export default class BackgroundMusic {
    constructor(game) {
        this.game = game
        this.backgroundMusic = new Audio(backgroundMusicURL)
        this.backgroundMusic.loop = true
    }

    playBackgroundMusic(){
        // If the game is over, pause the background music (this does not work yet)
        if (this.game.gameOver) {
            this.backgroundMusic.pause()
            this.backgroundMusic.currentTime = 0
        } else {
            // Remember to loop the music
            this.backgroundMusic.play()
        }
    }
}