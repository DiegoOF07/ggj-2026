import type { Player } from '../models/player.ts'

class GameState {
  players: Player[] = []
  currentRound = 0
  started = false
  winner: 'impostors' | 'crewmates' | null = null

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
    this.winner = null
  }

  checkgameEnd(): boolean {
    const activePlayers = this.players.filter(player => player.isActive)
    const impostors = activePlayers.filter(player => player.isImpostor)
    const crewmates = activePlayers.filter(player => !player.isImpostor)
    
    // Victoria de tripulantes: todos los impostores eliminados
    if (impostors.length === 0) {
      this.winner = 'crewmates'
      return true
    } 
    
    // Victoria de impostores: impostores igualan o superan a tripulantes
    // o no quedan tripulantes
    if (crewmates.length === 0 || impostors.length >= crewmates.length) {
      this.winner = 'impostors'
      return true
    }
    
    return false
  }
}

export const gameState = new GameState()