export default class InputHandler {
  constructor(game) {
    this.game = game
    this.api = game.api
    this.mouseX = 0
    this.mouseY = 0

    window.addEventListener('keydown', (event) => {
      if (
        (event.key === 'ArrowUp' ||
          event.key === 'ArrowDown' ||
          event.key === 'ArrowLeft' ||
          event.key === 'ArrowRight' ||
          event.key === 'w' ||
          event.key === 'a' ||
          event.key === 's' ||
          event.key === 'd' ||
          event.key === 'j') &&
        this.game.keys.indexOf(event.key) === -1
      ) {
        this.game.keys.push(event.key)
      }

      if (event.key === ' ') {
        this.game.gameStart = true
        this.game.audio.backgroundMusic.play()
        this.game.audio.menuMusic.pause()
        this.game.audio.bowSound.volume = 1
      }

      if (event.key === 'c') {
        this.game.viewControls = !this.game.viewControls
      }

      if (event.key === 'v') {
        this.game.viewCredits = !this.game.viewCredits
      }

      if (event.key === 'p') {
        this.game.debug = !this.game.debug
      }
      if (event.key === 'j') {
        this.game.secondPlayer.SlashInitiate()
      }

      // remember to change this and check if game is over or won
      if (event.key === 'Enter' && this.game.gameOver === true || event.key === 'Enter' && this.game.score >= 2000) {
        this.api.postScore()
      }
    })

    window.addEventListener('keyup', (event) => {
      if (this.game.keys.indexOf(event.key) > -1) {
        this.game.keys.splice(this.game.keys.indexOf(event.key), 1)
      }
    })

    window.addEventListener('mousemove', (event) => {
      this.mouseX = event.clientX - this.game.canvasPosition.left
      this.mouseY = event.clientY - this.game.canvasPosition.top
    })

    window.addEventListener('mousedown', (event) => {
      this.game.player.shoot(this.mouseX, this.mouseY)

    })
  }
}
