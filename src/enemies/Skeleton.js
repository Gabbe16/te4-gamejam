import Enemy from './Enemy.js'
import luciferSkeleton from '../assets/sprites/SkeletonWithSwordRightRun.png'
import luciferSkeletonDeath from '../assets/sprites/SkeletonWithSwordRightDeath.png'
import skeletonAttack from '../assets/sprites/SkeletonWithSwordRightAttack01.png'

export default class Skeleton extends Enemy {
  constructor(game, x, y) {
    super(game)
    this.width = 48
    this.height = 48
    this.x = x
    this.y = y
    this.baseSpeed = 2.5
    this.speed = this.baseSpeed
    this.lives = 1
    this.type = 'skeleton'
    this.scoreAmount = 30
    this.damage = 1
    this.baseDamage = 1

    this.isDead = false
    this.stayFlipped = false

    this.attackPlayer1 = false
    this.attackDone = false
    this.attackBegin = false
    this.attackPlayer2 = false
    this.attackDone2 = false
    this.attackBegin2 = false

    // Skeleton Walk Image
    const image = new Image()
    image.src = luciferSkeleton
    this.image = image

    // Skeleton Walk Animation
    this.frameX = 1
    this.frameY = 0
    this.maxFrame = 6
    this.fps = 20
    this.timer = 0
    this.interval = 1000 / this.fps

    //walk animation
    this.walkAnimation = {
      frameY: 0,
      maxFrame: 6
    }

    //skeleton death animation
    this.deathAnimation = {
      frameY: 0,
      maxFrame: 8
    }
     //attack animation
     this.attackAnimation = {
      frameY: 0,
      maxFrame: 8
    }

    // Flip sprite if x is greater than 400
    if (this.x > 400) {
      this.flip = true
    }
  }

  update(player, secondPlayer, deltaTime) {
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

      this.image.src = skeletonAttack
      
      this.maxFrame = this.attackAnimation.maxFrame
      if (this.frameX === 7 && !this.attackDone) {
        this.game.player.lives -= this.damage
        this.game.audio.playPlayerDamage()
        this.attackDone = true
      }
      
      if (this.frameX === this.attackAnimation.maxFrame - 1) {
        this.attackPlayer1 = false
        this.attackDone = false
        this.attackBegin = false
        this.image.src = luciferSkeleton
        this.maxFrame = this.walkAnimation.maxFrame
        this.frameX = 0
      }
    }
    if(this.attackPlayer2 && !this.isDead) {
      if(this.attackBegin2 === false) {
        this.attackBegin2 = true
        this.frameX = 0
      }

      this.image.src = skeletonAttack
      
      this.maxFrame = this.attackAnimation.maxFrame
      if (this.frameX === 7 && !this.attackDone2) {
        this.game.secondPlayer.lives -= this.damage
        this.game.audio.playPlayerDamage()
        this.attackDone2 = true
      }
      
      if (this.frameX === this.attackAnimation.maxFrame - 1) {
        this.attackPlayer2 = false
        this.attackDone2 = false
        this.attackBegin2 = false
        this.frameX = 0
        this.image.src = luciferSkeleton
        this.maxFrame = this.walkAnimation.maxFrame
      
        
       

      }
    }
    
    //skeleton death animation
    if (this.isDead) {
      if(this.flip) {
        this.stayFlipped = true
      }
      this.damage = 0
      this.speed = 0
      this.image.src = luciferSkeletonDeath
      this.maxFrame = this.deathAnimation.maxFrame
      if (this.frameX === this.deathAnimation.maxFrame - 1) {
        this.markedForDeletion = true
      }
    }
    
    // Skeleton Walk Animation and frame update
    if (this.timer > this.interval) {
      this.frameX++
      this.timer = 0
    } else {
      this.timer += deltaTime
    }
    
    if (this.frameX >= this.maxFrame) {
      this.frameX = 0
    }
    
    // calculate distance between player and the skeleton
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
    if(distance < 50 || distance2 < 50) {
      this.speed = 0
      if(this.flip) {
      this.stayFlipped = true
      }
    } else {
      this.speed = this.baseSpeed
      if(!this.isDead){
        this.stayFlipped = false
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
      this.flip || this.stayFlipped ? this.x * -1 - (this.width + 25) : this.x - 25,
      this.y - 25,
      this.width * 2,
      this.height * 2
    )

    if (this.flip) {
      context.restore()
    } else if (this.stayFlipped) {
      context.restore()
    }

    // Skeleton Debugging
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
