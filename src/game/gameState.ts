import type { Player } from '../models/player.ts'

class GameState {
  players: Player[] = []
  currentRound = 0
  started = false

  startGame(players: Player[]) {
    this.players = players
    this.currentRound = 1
    this.started = true
  }

  nextRound() {
    this.currentRound++
  }

  endGame() {
    this.started = false
    this.players = []
    this.currentRound = 0
  }
}

export const gameState = new GameState()
