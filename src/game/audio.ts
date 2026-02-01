const clickAudio = new Audio(
  new URL('@/assets/Audio/Boton_1.wav', import.meta.url).href
)
clickAudio.volume = 0.7

export function playClick() {
  clickAudio.currentTime = 0
  clickAudio.play()
}

const menuSong = new Audio(
  new URL('@/assets/Audio/Tema_Menu .wav', import.meta.url).href
)

menuSong.loop = true
menuSong.volume = 0.5

export function playMenuSong() {
  if (menuSong.paused) {
    menuSong.currentTime = 0
    menuSong.play()
  }
}

export function stopMenuSong() {
  menuSong.pause()
  menuSong.currentTime = 0
}
