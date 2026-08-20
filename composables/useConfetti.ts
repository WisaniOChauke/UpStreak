export const useConfetti = () => {
  const fire = async () => {
    if (!process.client) return
    const confetti = (await import('canvas-confetti')).default
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FBBF24', '#F59E0B', '#D97706', '#FDE68A', '#ffffff'],
    })
  }
  return { fire }
}
