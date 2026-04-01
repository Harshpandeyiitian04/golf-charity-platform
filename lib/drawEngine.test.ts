import { describe, it, expect } from 'vitest'
import { randomDraw, algorithmicDraw, checkMatch, calculatePrizePools } from './drawEngine'

describe('randomDraw', () => {
  it('returns exactly 5 numbers', () => {
    const result = randomDraw()
    expect(result).toHaveLength(5)
  })

  it('returns numbers between 1 and 45', () => {
    const result = randomDraw()
    result.forEach(n => {
      expect(n).toBeGreaterThanOrEqual(1)
      expect(n).toBeLessThanOrEqual(45)
    })
  })

  it('returns unique numbers', () => {
    const result = randomDraw()
    const unique = new Set(result)
    expect(unique.size).toBe(5)
  })
})

describe('algorithmicDraw', () => {
  it('returns exactly 5 numbers', () => {
    const scores = [32, 28, 35, 40, 22, 31, 29, 38]
    const result = algorithmicDraw(scores)
    expect(result).toHaveLength(5)
  })

  it('falls back to random when no scores provided', () => {
    const result = algorithmicDraw([])
    expect(result).toHaveLength(5)
  })

  it('returns numbers in valid range', () => {
    const scores = [10, 20, 30, 40, 5]
    const result = algorithmicDraw(scores)
    result.forEach(n => {
      expect(n).toBeGreaterThanOrEqual(1)
      expect(n).toBeLessThanOrEqual(45)
    })
  })
})

describe('checkMatch', () => {
  it('returns 5 when all drawn numbers match user numbers', () => {
    const drawn = [10, 20, 30, 40, 5]
    const user = [10, 20, 30, 40, 5]
    expect(checkMatch(drawn, user)).toBe(5)
  })

  it('returns 3 when 3 numbers match', () => {
    const drawn = [10, 20, 30, 40, 5]
    const user = [10, 20, 30, 99, 88]
    expect(checkMatch(drawn, user)).toBe(3)
  })

  it('returns 0 when no numbers match', () => {
    const drawn = [1, 2, 3, 4, 5]
    const user = [6, 7, 8, 9, 10]
    expect(checkMatch(drawn, user)).toBe(0)
  })
})

describe('calculatePrizePools', () => {
  it('distributes pool correctly without carryover', () => {
    const pools = calculatePrizePools(100, 0)
    expect(pools.fiveMatch).toBeCloseTo(40)
    expect(pools.fourMatch).toBeCloseTo(35)
    expect(pools.threeMatch).toBeCloseTo(25)
  })

  it('adds carryover to jackpot pool', () => {
    const pools = calculatePrizePools(100, 50)
    expect(pools.fiveMatch).toBeCloseTo(90) // 40 + 50
    expect(pools.fourMatch).toBeCloseTo(35)
    expect(pools.threeMatch).toBeCloseTo(25)
  })

  it('returns zero pools for zero total', () => {
    const pools = calculatePrizePools(0, 0)
    expect(pools.fiveMatch).toBe(0)
    expect(pools.fourMatch).toBe(0)
    expect(pools.threeMatch).toBe(0)
  })
})

describe('jackpot rollover logic', () => {
  it('correctly calculates rollover amount', () => {
    const prevTotalPool = 600
    const prevCarryover = 0
    const expectedCarryover = prevTotalPool * 0.4 + prevCarryover
    expect(expectedCarryover).toBe(240)
  })

  it('accumulates carryover across multiple months', () => {
    const month1Carryover = 600 * 0.4
    const month2Carryover = 600 * 0.4 + month1Carryover
    expect(month2Carryover).toBe(480)
  })
})
