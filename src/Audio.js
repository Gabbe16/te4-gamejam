import backgroundMusicURL from './assets/sounds/music/backgroundMusic.mp3';
import menuMusicURL from './assets/sounds/music/mainMenuMusic.mp3'
import bowSoundURL from './assets/sounds/attacks/bow.wav'
import damage1URL from './assets/sounds/damage/damage1.wav'
import damage2URL from './assets/sounds/damage/damage2.wav'
import damage3URL from './assets/sounds/damage/damage3.wav'
import playerDamageURL from './assets/sounds/damage/playerdamage3.wav'
import playerDeathURL from './assets/sounds/damage/playerdeath.wav'
import MeleeAttackURL from './assets/sounds/attacks/meleeAttack.wav'
import FireSoundURL from './assets/sounds/attacks/fireSound.wav'


export default class BackgroundMusic {
    constructor(game) {
        this.game = game
        this.backgroundMusic = new Audio(backgroundMusicURL)
        this.menuMusic = new Audio(menuMusicURL)
        this.bowSound = new Audio(bowSoundURL)
        this.audioRandom = 1

        //attack sounds
        this.MeleeAttack = new Audio(MeleeAttackURL)
        this.FireSound = new Audio(FireSoundURL)

        //damage sounds
        this.damage1 = new Audio(damage1URL)
        this.damage2 = new Audio(damage2URL)
        this.damage3 = new Audio(damage3URL)
        this.playerDamage = new Audio(playerDamageURL)
        this.playerDeath = new Audio(playerDeathURL)

        // Loop the background music when it ends
        this.backgroundMusic.loop = true
        this.menuMusic.loop = true

        //Volume (1 to 0)
        this.backgroundMusic.volume = 1
        this.menuMusic.volume = 0.1
        this.bowSound.volume = 0
        this.damage1.volume = 1
        this.damage2.volume = 1
        this.damage3.volume = 1


        //audio speed
        this.bowSound.playbackRate = 1.3;

        /*         this.i = 1 */
    }

    playBackgroundMusic() {
        this.backgroundMusic.play()
    }

    playMenuMusic() {
        this.menuMusic.play()
    }

    playBowSound() {
        const newBowSound = this.bowSound.cloneNode()
        newBowSound.play()
        //this.bowSound.play()
    }

    // Damage sounds
    playDamage1() {
        const newDamage1 = this.damage1.cloneNode()
        newDamage1.play()


    }
    playDamage2() {
        const newDamage2 = this.damage2.cloneNode()
        newDamage2.play()

    }
    playDamage3() {
        const newDamage3 = this.damage3.cloneNode()
        newDamage3.play()

    }

    playPlayerDamage() {
        const newPlayerDamage = this.playerDamage.cloneNode()
        newPlayerDamage.play()
        /* this.playerDamage.play() */
    }

    playPlayerDeath() {
        this.playerDeath.play()
    }

    playMeleeAttack() {
        const newMeleeAttack = this.MeleeAttack.cloneNode()
        newMeleeAttack.play()
    }
    playFireSound() {
        const newFireSound = this.FireSound.cloneNode()
        newFireSound.play()
    }

    playDamageSound() {
        const i = Math.floor(Math.random() * 3) + 1
        if (i === 1) {
            const newDamage1 = this.damage1.cloneNode()
            newDamage1.play()
            console.log("1")
        } else if (i === 2) {
            const newDamage2 = this.damage2.cloneNode()
            newDamage2.play()
            console.log("2")
        } else {
            const newDamage3 = this.damage3.cloneNode()
            newDamage3.play()
            console.log("3")
        }
    }

    /* 
        playDamage(){
            console.log("gahsahpsa")
            if(this.i=1){
                console.log("1")
                this.damage1.play()
                this.i++
            } else if(this.i=2){
                console.log("2")
                this.damage2.play()
                this.i++
            } else {
                console.log("3")
                this.damage3.play()
                this.i = 1
            }
    
        } */
}