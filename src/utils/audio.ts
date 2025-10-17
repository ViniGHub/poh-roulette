// Simple audio utilities using Web Audio API
let audioContext: AudioContext | null = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

export function playStartSound() {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.type = 'sawtooth'
    oscillator.frequency.value = 220
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02)
    oscillator.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.45)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
    
    oscillator.start()
    oscillator.stop(ctx.currentTime + 1.25)
  } catch (error) {
    console.error('Error playing start sound:', error)
  }
}

export function playTickSound() {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.type = 'square'
    oscillator.frequency.value = 1200
    gainNode.gain.value = 0.08
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.03)
  } catch (error) {
    console.error('Error playing tick sound:', error)
  }
}