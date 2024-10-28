import key_w_image from './assets/controls_images/key_W.png'
import key_s_image from './assets/controls_images/key_S.png'
import key_a_image from './assets/controls_images/key_A.png'
import key_d_image from './assets/controls_images/key_D.png'
import key_j_image from './assets/controls_images/key_J.png'

import arrowkey_down_image from './assets/controls_images/arrowkey_DOWN.png'
import arrowkey_left_image from './assets/controls_images/arrowkey_LEFT.png'
import arrowkey_right_image from './assets/controls_images/arrowkey_RIGHT.png'
import arrowkey_up_image from './assets/controls_images/arrowkey_UP.png'
import mouse_image from './assets/controls_images/controlPrompts.png'


import Menuparalax from './Menuparalax.js'

export default class UserInterface {
  constructor(game) {
    this.game = game
    this.fontSize = 25
    this.fontFamily = 'dungeonFont'
    this.color = 'White'

    this.menuTime = 0
    this.menubackground = new Menuparalax(this.game)

    // Load player1 controls images
    const keyW = new Image()
    keyW.src = key_w_image
    this.keyW = keyW

    const keyS = new Image()
    keyS.src = key_s_image
    this.keyS = keyS

    const keyA = new Image()
    keyA.src = key_a_image
    this.keyA = keyA

    const keyD = new Image()
    keyD.src = key_d_image
    this.keyD = keyD

    const keyJ = new Image()
    keyJ.src = key_j_image
    this.keyJ = keyJ

    // Load player2 controls images
    const arrowkeyleft = new Image()
    arrowkeyleft.src = arrowkey_left_image
    this.arrowleft = arrowkeyleft

    const arrowkeyright = new Image()
    arrowkeyright.src = arrowkey_right_image
    this.arrowright = arrowkeyright

    const arrowkeyup = new Image()
    arrowkeyup.src = arrowkey_up_image
    this.arrowup = arrowkeyup

    const arrowkeydown = new Image()
    arrowkeydown.src = arrowkey_down_image
    this.arrowdown = arrowkeydown

    const mouseicon = new Image()
    mouseicon.src = mouse_image
    this.mouseicon = mouseicon
    
  }

  update(deltaTime) {
    if (this.game.mainMenu === true) {
      this.menuTime += deltaTime
      this.menubackground.update()
    }
  }

  draw(context) {
    context.save()
    context.fillStyle = this.color
    context.shadowOffsetX = 4
    context.shadowOffsetY = 4
    context.shadowColor = 'black'

    context.textAlign = 'left'
    context.font = `${this.fontSize}px ${this.fontFamily}`

    // Main menu interface if the game has not been started
    if (this.game.gameStart === false) {
      if (this.game.viewControls === true) {
        // Controls UI
        context.textAlign = 'center'
        context.font = `75px ${this.fontFamily}`
        context.fillText('Controls', this.game.width / 2, 150)
        context.fillText('Player 1', this.game.width / 3.5, this.game.height / 5.35)
        context.fillText('Player 2', this.game.width - 495, this.game.height / 5.35)
        context.textAlign = 'right'
        context.font = `40px ${this.fontFamily}`
        context.fillText('Press c to return to main menu', this.game.width - 20, this.game.height - 20)

        // Player 1 text and control images
        context.textAlign = 'center'
        context.font = `40px ${this.fontFamily}`
        context.fillText('Movement', this.game.width / 3.5, this.game.height / 4)
        context.fillText('Melee Attack', this.game.width / 3.5, this.game.height - 450)
        context.drawImage(this.keyW, 0, 0, 32, 32, this.game.width / 3.75, this.game.height / 3.5, 64, 64)
        context.drawImage(this.keyS, 0, 0, 32, 32, this.game.width / 3.75, this.game.height / 2.75, 64, 64)
        context.drawImage(this.keyA, 0, 0, 32, 32, this.game.width / 4.45, this.game.height / 2.75, 64, 64)
        context.drawImage(this.keyD, 0, 0, 32, 32, this.game.width / 3.23, this.game.height / 2.75, 64, 64)
        context.drawImage(this.keyJ, 0, 0, 32, 32, this.game.width / 3.75, this.game.height / 1.8, 64, 64)
        
        // Player 2 text and control images
        context.textAlign = 'center'
        context.font = `40px ${this.fontFamily}`
        context.fillText('Movement', this.game.width - 495, this.game.height / 4)
        context.fillText('Cast Spell', this.game.width - 495, this.game.height - 450)
        context.drawImage(this.arrowup, 0, 0, 32, 32, this.game.width - 525, this.game.height / 3.5, 64, 64)
        context.drawImage(this.arrowdown, 0, 0, 32, 32, this.game.width - 525, this.game.height / 2.75, 64, 64)
        context.drawImage(this.arrowleft, 0, 0, 32, 32, this.game.width - 450, this.game.height / 2.75, 64, 64)
        context.drawImage(this.arrowright, 0, 0, 32, 32, this.game.width - 600, this.game.height / 2.75, 64, 64)
        context.shadowColor = 'transparent'
        context.drawImage(this.mouseicon, 185, -132, 245, 203, this.game.width - 515, this.game.height - 550, 245, 203)
      } else if (this.game.viewCredits == true) {
        // Credits ui
        context.textAlign = 'center'
        context.font = `75px ${this.fontFamily}`
        context.fillText('Credits', this.game.width / 2, 150)
        context.textAlign = 'right'
        context.font = `40px ${this.fontFamily}`
        context.fillText('Press v to return to main menu', this.game.width - 20, this.game.height - 20)
      } else {
        // Main menu background
        context.shadowColor = 'transparent'
        this.menubackground.draw(context)
       
        //background music
        this.game.audio.menuMusic.play()

        // Main menu
        context.textAlign = 'center'
        context.font = `75px ${this.fontFamily}`
        context.fillText('PLACEHOLDER NAME', this.game.width / 2, this.game.height / 4)
        context.font = `45px ${this.fontFamily}`
        context.textAlign = 'center'
        context.fillText('Press SPACE to start', this.game.width / 2, this.game.height / 2.45,)
        context.font = `45px ${this.fontFamily}`
        context.fillText('Press C for controls', this.game.width / 2, this.game.height / 2)
        context.font = `45px ${this.fontFamily}`
        context.fillText('Press V for credits', this.game.width / 2, this.game.height / 1.7)
       
        // Credits
        context.textAlign = 'right'
        context.font = `30px ${this.fontFamily}`
        context.fillText('Created by: Gabbe and Mille', this.game.width - 20, this.game.height - 20) 
      }
    } else if (this.game.gameStart === true) {
      
      // Player ammo and lives ui
      context.fillStyle = 'rgba(128, 128, 128, 0.5)'
      context.shadowColor = 'transparent'
      context.strokeRect(76, 880, this.game.width / 7, 50)
      context.fillRect(76, 880, this.game.width / 7, 50)
      context.fillStyle = 'rgba(255, 255, 255, 255)'
      context.shadowColor = 'black'
      context.shadowOffsetX = 2
      context.shadowOffsetY = 2
      context.fillText(`Lives: ${this.game.player.lives}`, 110, 920)
      context.fillText(`Ammo: ${this.game.player.ammo}`, 210, 920)

      // Time ui
      context.fillStyle = 'rgba(128, 128, 128, 0.5)'
      context.shadowColor = 'transparent'
      context.strokeRect(76, 20, this.game.width / 8, 50)
      context.fillRect(76, 20, this.game.width / 8, 50)
      context.fillStyle = 'rgba(255, 255, 255, 255)'
      context.shadowColor = 'black'
      context.shadowOffsetX = 2
      context.shadowOffsetY = 2
      context.fillText(`Time: ${(this.game.gameTime * 0.001).toFixed(1)}`, 110, 59)
      context.fillText(`Score: ${(this.game.score)}`, 210, 59)
    }

    if (this.game.gameOver) {
      context.textAlign = 'center'
      context.font = `50px ${this.fontFamily}`
      context.fillText(
        'Game over',
        this.game.width / 2,
        this.game.height / 2 - 20
      )
    }

    // debug
    if (this.game.debug) {
      context.font = `15px Arial`
      context.textAlign = 'right'
      context.fillText(`x: ${this.game.player.x}`, this.game.width - 20, 25)
      context.fillText(`y: ${this.game.player.y}`, this.game.width - 20, 50)
      context.fillText(
        `mouseX: ${this.game.input.mouseX}`,
        this.game.width - 20,
        75
      )
      context.fillText(
        `mouseY: ${this.game.input.mouseY}`,
        this.game.width - 20,
        100
      )
      context.fillText(
        `maxSpeed: ${this.game.player.maxSpeed}`,
        this.game.width - 20,
        125
      )
      context.fillText(`keys: ${this.game.keys}`, this.game.width - 20, 150)
    }

    context.restore()
  }
}
