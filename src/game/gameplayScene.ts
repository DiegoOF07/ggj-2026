import Phaser from 'phaser'
import type { Player } from '../models/player.ts'

export class GameplayScene extends Phaser.Scene {
  players: Player[]

  constructor(players: Player[]) {
    super('GameplayScene')
    this.players = players
  }

  preload() {
    this.load.image('player', '../../src/assets/Test1/Player01.png');
  }

  create() {
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

      const sprite = this.add.sprite(
        x + spriteWidth / 2,
        centerY,
        'player'
      )

      sprite.setDisplaySize(spriteWidth, spriteHeight)

      this.add.text(
        sprite.x,
        sprite.y + spriteHeight / 2 + 10,
        player.name,
        {
          fontSize: '14px',
          color: '#ffffff'
        }
      ).setOrigin(0.5, 0)
    })
  }
}
