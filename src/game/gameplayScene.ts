import Phaser from 'phaser'
import type { Player } from '../models/player.ts'

export class GameplayScene extends Phaser.Scene {
  players: Player[]

  constructor(players: Player[]) {
    super('GameplayScene')
    this.players = players
  }

  create() {
    const MAX_VISIBLE = 7
    const visiblePlayers = this.players.slice(0, MAX_VISIBLE)

    const rectWidth = 125
    const rectHeight = 250

    const spacing = 20
    const totalWidth =
      visiblePlayers.length * rectWidth +
      (visiblePlayers.length - 1) * spacing

    const startX = (this.scale.width - totalWidth) / 2
    const centerY = this.scale.height / 2

    visiblePlayers.forEach((player, index) => {
      const x = startX + index * (rectWidth + spacing)
      const y = centerY

      // Rectángulo placeholder
      this.add.rectangle(
        x + rectWidth / 2,
        y,
        rectWidth,
        rectHeight,
        0x4a90e2
      )

      // Nombre del jugador (debug / placeholder)
      this.add.text(
        x + rectWidth / 2,
        y + rectHeight / 2 + 10,
        player.name,
        {
          fontSize: '14px',
          color: '#ffffff'
        }
      ).setOrigin(0.5, 0)
    })
  }
}
