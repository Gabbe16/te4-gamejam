import bgURL from './assets/sounds/backgroundMusic.mp3';

export default class BackgroundMusic {
    constructor(game) {
        this.game = game
        const bgMusic = new Audio()
        bgMusic.src = bgURL
        this.backgroundmusic = bgMusic
    }

    playBackgroundMusic(){
        this.backgroundMusic.currentTime = 0
        this.backgroundMusic.play()
    }
}