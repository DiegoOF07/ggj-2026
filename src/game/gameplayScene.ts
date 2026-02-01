import Phaser from 'phaser'
import type { Player } from '../models/player.ts'

export class GameplayScene extends Phaser.Scene {
  players: Player[]
  playerContainers = new Map<string, Phaser.GameObjects.Container>()
  playerSprites = new Map<string, Phaser.GameObjects.Sprite>()
  maskSprites = new Map<string, Phaser.GameObjects.Sprite>()
  modalContainer?: Phaser.GameObjects.Container
  modalOpen = false

  sounds!: {
    click: Phaser.Sound.BaseSound
    click_grave: Phaser.Sound.BaseSound
    victoria: Phaser.Sound.BaseSound
    derrota: Phaser.Sound.BaseSound
    menu: Phaser.Sound.BaseSound
    juego1: Phaser.Sound.BaseSound
    juego2: Phaser.Sound.BaseSound
    sospechoso: Phaser.Sound.BaseSound
  }

  constructor(players: Player[]) {
    super('GameplayScene')
    this.players = players
  }

  preload() {
    this.load.image('player', '../../src/assets/Test1/Player01.png')
    this.load.image('background', '../../src/assets/Background/Background01.png')
    this.load.image('foreground', '../../src/assets/Background/Foreground1.png')
    

    this.load.audio('click', '../../src/assets/Audio/Boton_1.wav')
    this.load.audio('click_grave', '../../src/assets/Audio/Boton_2.wav')
    this.load.audio('victoria', '../../src/assets/Audio/Stinger_Victoria.wav')
    this.load.audio('derrota', '../../src/assets/Audio/Stinger_Derrota.wav')
    this.load.audio('menu', '../../src/assets/Audio/Tema_Menu .wav')
    this.load.audio('juego1', '../../src/assets/Audio/Tema_Gameplay_01.wav')
    this.load.audio('juego2', '../../src/assets/Audio/Tema_Gameplay_02.wav')
    this.load.audio('sospechoso', '../../src/assets/Audio/Mouse_sobre_sospechoso.mp3')

    for (let i = 1; i <= 8; i++) {
      this.load.image(
        `mask${i}`,
        `../../src/assets/masks/mask${i}.png`
      )
    }
  }

  create() {
    const bg = this.add.image(640, 360, 'background');

     this.sounds = {
      click: this.sound.add('click', { loop: false, volume: 0.75 }),
      click_grave: this.sound.add('click_grave'),
      victoria: this.sound.add('victoria'),
      derrota: this.sound.add('derrota'),
      menu: this.sound.add('menu', { loop: true, volume: 0.5 }),
      juego1: this.sound.add('juego1', { loop: false, volume: 0.5 }),
      juego2: this.sound.add('juego2', { loop: true, volume: 0.5 }),
      sospechoso: this.sound.add('sospechoso', {loop: false, volume: 1} )
    }
    this.sounds.juego1.play()
    this.sounds.juego2.play()

    const scaleX = this.scale.width / bg.width
    const scaleY = this.scale.height / bg.height

    const scale = Math.max(scaleX, scaleY)
    bg.setScale(scale)

    const MAX_VISIBLE = 8
    const visiblePlayers = this.players.slice(0, MAX_VISIBLE)

    const spriteWidth = 125
    const spriteHeight = 250
    const spacing = 10

    const totalWidth =
      visiblePlayers.length * spriteWidth +
      (visiblePlayers.length - 1) * spacing

    const startX = (this.scale.width - totalWidth) / 2
    const centerY = this.scale.height / 2

    visiblePlayers.forEach((player, index) => {
      const x = startX + index * (spriteWidth + spacing)

      player.maskKey ??= this.getRandomMask()

      const playerSprite = this.add.sprite(0, 0, 'player')
      playerSprite.setDisplaySize(spriteWidth, spriteHeight)
      playerSprite.setScale(1.5)

      const maskSprite = this.add.sprite(0, 0, player.maskKey)
      maskSprite.setDisplaySize(spriteWidth, spriteHeight)
      maskSprite.setScale(1.5)

      const playerContainer = this.add.container(
        x + spriteWidth / 2,
        centerY + 70,
        [playerSprite, maskSprite]
      )

      playerContainer.setSize(spriteWidth, spriteHeight)
      playerContainer.setInteractive(
        new Phaser.Geom.Rectangle(
          -spriteWidth / 2,
          -spriteHeight / 2,
          spriteWidth,
          spriteHeight
        ),
        Phaser.Geom.Rectangle.Contains
      )
      playerContainer.on('pointerover', () => {
        if (!player.isActive || this.modalOpen) return
        playerContainer.setScale(1.05)
        this.sounds.sospechoso.play()
      })

      playerContainer.on('pointerout', () => {
        playerContainer.setScale(1)
      })

      playerContainer.on('pointerdown', () => {
        if (!player.isActive || this.modalOpen) return
        this.openConfirmModal(player)
      })

      this.playerContainers.set(player.name, playerContainer)
      this.maskSprites.set(player.name, maskSprite)
      
      this.add
        .text(playerContainer.x, playerContainer.y + spriteHeight / 2 + 80, player.name, {
          fontSize: '18px',
          color: '#ffffff'
        })
        .setOrigin(0.5, 0)
    })
    
    const fg = this.add.image(640, 360, 'foreground');
    fg.setScale(scale)
  }

  getRandomMask(): string {
    const index = Phaser.Math.Between(1, 8)
    return `mask${index}`
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
      this.sounds.click.play()
      
      window.dispatchEvent(
        new CustomEvent('game:player-eliminated', {
          detail: player.name
        })
      )
      this.removePlayer(player.name)
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
      this.sounds.click.play()
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

  getPlayer(name: string): Player | undefined {
    return this.players.find(p => p.name === name)
  }

  removePlayer(name: string) {
    const player = this.getPlayer(name)
    const container = this.playerContainers.get(name)
    const mask = this.maskSprites.get(name)

    if (!player || !container) return

    player.isActive = false

    mask?.destroy()
    this.maskSprites.delete(name)

    container
      .setAlpha(0.6)
      .disableInteractive()
  }
}
