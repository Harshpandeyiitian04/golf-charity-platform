// Random draw - picks 5 unique numbers between 1-45
export function randomDraw(): number[] {
  const numbers = new Set<number>()
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  return [...numbers].sort((a, b) => a - b)
}

// Algorithmic draw - weighted by most frequent user scores
export function algorithmicDraw(allScores: number[]): number[] {
  if (allScores.length === 0) return randomDraw()

  const freq: Record<number, number> = {}
  allScores.forEach(s => {
    freq[s] = (freq[s] || 0) + 1
  })

  const pool: number[] = []
  Object.entries(freq).forEach(([score, count]) => {
    for (let i = 0; i < count; i++) pool.push(Number(score))
  })

  const shuffled = pool.sort(() => Math.random() - 0.5)
  const picked = new Set<number>()
  for (const n of shuffled) {
    picked.add(n)
    if (picked.size === 5) break
  }

  while (picked.size < 5) {
    picked.add(Math.floor(Math.random() * 45) + 1)
  }

  return [...picked].sort((a, b) => a - b)
}

// Check how many of a user's scores match the drawn numbers
export function checkMatch(drawnNumbers: number[], userNumbers: number[]): number {
  return userNumbers.filter(n => drawnNumbers.includes(n)).length
}

// Calculate prize pool distribution
export function calculatePrizePools(totalPool: number, jackpotCarryover: number = 0) {
  return {
    fiveMatch: totalPool * 0.40 + jackpotCarryover,
    fourMatch: totalPool * 0.35,
    threeMatch: totalPool * 0.25,
  }
}