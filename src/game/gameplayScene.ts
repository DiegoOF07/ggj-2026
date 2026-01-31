import Phaser from 'phaser'
import type { Player } from '../models/player.ts'

export class GameplayScene extends Phaser.Scene {
  players: Player[]
  playerSprites = new Map<string, Phaser.GameObjects.Sprite>()

  constructor(players: Player[]) {
    super('GameplayScene')
    this.players = players
  }

  preload() {
    this.load.image('player', '../../src/assets/Test1/Player01.png')
  }

  create() {
    window.addEventListener('vue:delete-player', this.onDeletePlayer)
    window.addEventListener('vue:modal-open', this.disableInput)
    window.addEventListener('vue:modal-close', this.enableInput)

    const MAX_VISIBLE = 7
    const visiblePlayers = this.players.slice(0, MAX_VISIBLE)

    const spriteWidth = 125
    const spriteHeight = 250
    const spacing = 20

    const totalWidth =
      visiblePlayers.length * spriteWidth +
      (visiblePlayers.length - 1) * spacing

    const startX = (this.scale.width - totalWidth) / 2
    const centerY = this.scale.height / 2

    visiblePlayers.forEach((player, index) => {
      const x = startX + index * (spriteWidth + spacing)

      const sprite = this.add
        .sprite(x + spriteWidth / 2, centerY, 'player')
        .setInteractive({ useHandCursor: true })

      sprite.setDisplaySize(spriteWidth, spriteHeight)

      sprite.on('pointerover', () => {
        sprite.setTint(0xff0000)
      })

      sprite.on('pointerout', () => {
        sprite.clearTint()
      })

      sprite.on('pointerdown', () => {
        window.dispatchEvent(
          new CustomEvent('phaser:player-clicked', {
            detail: player
          })
        )
      })

      sprite.setData('playerName', player.name)
      this.playerSprites.set(player.name, sprite)

      this.add
        .text(sprite.x, sprite.y + spriteHeight / 2 + 10, player.name, {
          fontSize: '14px',
          color: '#ffffff'
        })
        .setOrigin(0.5, 0)
    })
    
  }

  onDeletePlayer = (event: Event) => {
    const customEvent = event as CustomEvent<string>
    const playerName = customEvent.detail

    const sprite = this.playerSprites.get(playerName)
    if (!sprite) return
  
    sprite.setTint(0x808080)
    sprite.disableInteractive()
  }

  shutdown() {
    window.removeEventListener('vue:delete-player', this.onDeletePlayer)
    window.removeEventListener('vue:modal-open', this.disableInput)
    window.removeEventListener('vue:modal-close', this.enableInput)
    this.playerSprites.clear()
  }

  disableInput = () => {
    this.playerSprites.forEach(sprite => {
      sprite.disableInteractive()
    })
  }

  enableInput = () => {
    this.playerSprites.forEach(sprite => {
      sprite.setInteractive({ useHandCursor: true })
    })
  }
}
