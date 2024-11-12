import Enemy from './Enemy.js'
import ancientskeletonimage from '../assets/sprites/AncientSkeletonRightWalk.png'
import ancientSkeletonDeath from '../assets/sprites/AncientSkeletonRightDeath.png'
import ancientSkeletonHit from '../assets/sprites/AncientSkeletonRightHurt.png'
import ancientSkeletonAttack from '../assets/sprites/AncientSkeletonRightAttack01.png'
export default class AncientSkeleton extends Enemy {
  constructor(game, x, y) {
    super(game)
    this.width = 96
    this.height = 96
    this.x = x
    this.y = y
    this.speed = 1.5
    this.lives = 5
    this.type = 'ancientskeleton'
    this.scoreAmount = 60
    this.damage = 2
    this.baseDamage = 2

    this.isDead = false
    this.isHit = false
    this.stayFlipped = false

    this.attackPlayer1 = false
    this.attackDone = false
    this.attackBegin = false
    this.attackPlayer2 = false
    this.attackDone2 = false
    this.attackBegin2 = false

    // AncientSkeleton Walk Image
    const image = new Image()
    image.src = ancientskeletonimage
    this.image = image

    // AncientSkeleton Walk Animation
    this.frameX = 1
    this.frameY = 0
    this.maxFrame = 8
    this.fps = 20
    this.timer = 0
    this.interval = 1000 / this.fps

    //skeleton death animation
    this.deathAnimation = {
      frameY: 0,
      maxFrame: 9
    }
    //hit animation
    this.hitAnimation = {
      frameY: 0,
      maxFrame: 4
    }
    //attack animation
    this.attackAnimation = {
      frameY: 0,
      maxFrame: 7
    }

    // Flip sprite if x is greater than 400
    if (this.x > 400) {
      this.flip = true
    }
  }

  update(player, secondPlayer, deltaTime) {
    // AncientSkeleton Walk Animation
    if (this.speedX < 0) {
      this.flip = true
    } else if (this.speedX > 0) {
      this.flip = false
    }
    if(this.attackPlayer1 && !this.isDead) {
      if(this.attackBegin === false) {
        this.attackBegin = true
        this.frameX = 0
      }

      this.image.src = ancientSkeletonAttack
      this.width = 80
      this.height = 80
      this.maxFrame = this.attackAnimation.maxFrame
      if (this.frameX === 6 && !this.attackDone) {
        this.game.player.lives -= this.damage
        this.game.audio.playPlayerDamage()
        this.attackDone = true
      }
      
      if (this.frameX === this.attackAnimation.maxFrame - 1) {
        this.attackPlayer1 = false
        this.attackDone = false
        this.attackBegin = false
        this.frameX = 0
        this.width = 96
        this.height = 96
        this.image.src = ancientskeletonimage
        
       

      }
    }
    if(this.attackPlayer2 && !this.isDead) {
      if(this.attackBegin2 === false) {
        this.attackBegin2 = true
        this.frameX = 0
      }

      this.image.src = ancientSkeletonAttack
      this.width = 80
      this.height = 80
      this.maxFrame = this.attackAnimation.maxFrame
      if (this.frameX === 6 && !this.attackDone2) {
        this.game.secondPlayer.lives -= this.damage
        this.game.audio.playPlayerDamage()
        this.attackDone2 = true
      }
      
      if (this.frameX === this.attackAnimation.maxFrame - 1) {
        this.attackPlayer2 = false
        this.attackDone2 = false
        this.attackBegin2 = false
        this.frameX = 0
        this.width = 96
        this.height = 96
        this.image.src = ancientskeletonimage
        
       

      }
    }

    // AncientSkeleton Hit Animation
    if (this.isHit && !this.isDead) {
      this.width = 80
      this.height = 80
      this.maxFrame = this.hitAnimation.maxFrame
      this.image.src = ancientSkeletonHit
      if (this.frameX === this.hitAnimation.maxFrame - 1) {
        this.isHit = false
        this.image.src = ancientskeletonimage
        this.width = 96
        this.height = 96
      }
    }

    //skeleton death animation
    if (this.isDead) {
      if(this.flip) {
        this.stayFlipped = true
      }
      this.width = 80
      this.damage = 0
      this.speed = 0
      this.image.src = ancientSkeletonDeath
      this.maxFrame = this.deathAnimation.maxFrame
      if (this.frameX === this.deathAnimation.maxFrame - 1) {
        this.markedForDeletion = true
        this.width = 96
      }
    }

    // Frame update
    if (this.timer > this.interval) {
      this.frameX++
      this.timer = 0
    } else {
      this.timer += deltaTime
    }

    if (this.frameX >= this.maxFrame) {
      this.frameX = 0
    }

    // calculate distance between player and the skeletonBoss
    const dx = player.x - this.x
    const dy = player.y - this.y
    const dx2 = secondPlayer.x - this.x
    const dy2 = secondPlayer.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

    const speedX = (dx / distance) * this.speed
    const speedY = (dy / distance) * this.speed
    const speedX2 = (dx2 / distance2) * this.speed
    const speedY2 = (dy2 / distance2) * this.speed

    // if distance is greater than distance2 move towards player1 else move towards player2
    if (distance > distance2) {
      this.x += speedX2 
      this.y += speedY2 
      if(speedX2 < 0) {
        this.flip = true

      } else {
        this.flip = false
      }
    } else {
      this.x += speedX
      this.y += speedY
      if(speedX < 0) {
        this.flip = true
      } else {
        this.flip = false
      }
    }
  }

  draw(context) {
    if (this.flip) {
      context.save()
      context.scale(-1, 1)
    } else if (this.stayFlipped){
      context.save()
      context.scale(-1, 1)
    }

    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.flip || this.stayFlipped ? this.x * -1 - (this.width + 75) : this.x - 75,
      this.y - 35,
      this.width * 2,
      this.height * 2
    )

    if (this.flip) {
      context.restore()
    } else if (this.stayFlipped) {
      context.restore()
    }

    // AncientSkeleton Debugging
    if (this.game.debug) {
      context.strokeRect(this.x, this.y, this.width, this.height)
      context.fillStyle = 'black'
      context.font = '20px Arial'
      context.fillText(this.lives, this.x, this.y - 5)
      context.font = '12px Arial'
      context.fillText(`x: ${this.x.toFixed()}`, this.x + 20, this.y - 5)
      context.fillText(`y: ${this.y.toFixed()}`, this.x + 20, this.y - 20)
    }
  }
}
