import backgroundMusicURL from './assets/sounds/music/backgroundMusic.mp3';

export default class BackgroundMusic {
    constructor(game) {
        this.game = game
        this.backgroundMusic = new Audio(backgroundMusicURL)
        // Loop the background music when it ends
        this.backgroundMusic.loop = true
    }

    playBackgroundMusic(){
            this.backgroundMusic.play()
    }
}