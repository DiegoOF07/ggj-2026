import Phaser from 'phaser'
import type { Player } from '../models/player.ts'

export class GameplayScene extends Phaser.Scene {
  players: Player[]
  playerSprites = new Map<string, Phaser.GameObjects.Sprite>()
  modalContainer?: Phaser.GameObjects.Container
  modalOpen = false

  constructor(players: Player[]) {
    super('GameplayScene')
    this.players = players
  }

  preload() {
    this.load.image('player', '../../src/assets/Test1/Player01.png')
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

      const sprite = this.add
        .sprite(x + spriteWidth / 2, centerY, 'player')
        .setInteractive({ useHandCursor: true })

      sprite.setDisplaySize(spriteWidth, spriteHeight)

      // sprite.on('pointerover', () => {
      //   sprite.setTint(0xff0000)
      // })

      // sprite.on('pointerout', () => {
      //   sprite.clearTint()
      // })

      sprite.on('pointerdown', () => {
        if (this.modalOpen) return
        this.openConfirmModal(player)
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
    this.playerSprites.clear()
  }

  disableInput() {
    this.playerSprites.forEach(sprite => {
      sprite.disableInteractive()
    })
  }

  enableInput() {
    this.playerSprites.forEach(sprite => {
      sprite.setInteractive({ useHandCursor: true })
    })
  }

  closeModal() {
    this.modalOpen = false
    this.modalContainer?.destroy()
    this.modalContainer = undefined

    this.enableInput()
  }


  openConfirmModal(player: Player) {
    this.modalOpen = true
    this.disableInput()

    const { width, height } = this.scale

    const overlay = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setInteractive()

    const panel = this.add.rectangle(width / 2, height / 2, 360, 200, 0x1e293b)

    const text = this.add
      .text(width / 2, height / 2 - 40, `¿Desenmascarar a ${player.name}?`, {
        fontSize: '18px',
        color: '#ffffff'
      })
      .setOrigin(0.5)

    const confirmBtn = this.add
      .rectangle(width / 2 - 80, height / 2 + 50, 120, 40, 0x16a34a)
      .setInteractive({ useHandCursor: true })

    const confirmText = this.add
      .text(confirmBtn.x, confirmBtn.y, 'Confirmar', {
        fontSize: '14px',
        color: '#ffffff'
      })
      .setOrigin(0.5)

    confirmBtn.on('pointerdown', () => {
      window.dispatchEvent(
        new CustomEvent('game:player-eliminated', {
          detail: player.name
        })
      )
      this.disablePlayer(player.name)
      this.closeModal()
    })

    const cancelBtn = this.add
      .rectangle(width / 2 + 80, height / 2 + 50, 120, 40, 0xdc2626)
      .setInteractive({ useHandCursor: true })

    const cancelText = this.add
      .text(cancelBtn.x, cancelBtn.y, 'Cancelar', {
        fontSize: '14px',
        color: '#ffffff'
      })
      .setOrigin(0.5)

    cancelBtn.on('pointerdown', () => {
      this.closeModal()
    })

    this.modalContainer = this.add.container(0, 0, [
      overlay,
      panel,
      text,
      confirmBtn,
      confirmText,
      cancelBtn,
      cancelText
    ])
  }

  disablePlayer(name: string) {
    this.children.each((child: any) => {
      if (child.getData && child.getData('playerName') === name) {
        child.setTint(0x555555)
        child.disableInteractive()
      }
    })
  }
}
