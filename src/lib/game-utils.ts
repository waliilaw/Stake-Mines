// Generate a random game board with mines
export function generateGameBoard(size: number, minesCount: number) {
  // Create an empty grid
  const grid = Array(size)
    .fill(null)
    .map(() =>
      Array(size)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          adjacentMines: 0,
        })),
    )

  // Place mines randomly
  let minesPlaced = 0
  while (minesPlaced < minesCount) {
    const row = Math.floor(Math.random() * size)
    const col = Math.floor(Math.random() * size)

    if (!grid[row][col].isMine) {
      grid[row][col].isMine = true
      minesPlaced++

      // Update adjacent mines count for neighboring cells
      updateAdjacentMines(grid, row, col, size)
    }
  }

  return grid
}

// Update adjacent mines count for neighboring cells
function updateAdjacentMines(grid: any[][], row: number, col: number, size: number) {
  for (let r = Math.max(0, row - 1); r <= Math.min(size - 1, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(size - 1, col + 1); c++) {
      if (r !== row || c !== col) {
        grid[r][c].adjacentMines++
      }
    }
  }
}

// Calculate winnings based on revealed tiles
export function calculateWinnings(betAmount: number, revealedCount: number, safeTiles: number) {
  if (revealedCount === 0) return 0

  // Calculate multiplier based on revealed tiles
  // The more tiles revealed, the higher the multiplier
  const progressRatio = revealedCount / safeTiles
  let multiplier = 1 + progressRatio * 3

  // Apply exponential growth for higher revealed counts
  if (revealedCount > safeTiles / 2) {
    multiplier += Math.pow(progressRatio, 2) * 2
  }

  // Apply additional bonus for revealing almost all tiles
  if (revealedCount > safeTiles * 0.8) {
    multiplier += Math.pow(progressRatio, 3)
  }

  return betAmount * multiplier
}

// Calculate win probability
export function calculateProbability(totalTiles: number, minesCount: number) {
  const safeTiles = totalTiles - minesCount
  return (safeTiles / totalTiles) * 100
}

// Format currency
export function formatCurrency(amount: number): string {
  return amount.toFixed(2)
}

// Calculate multiplier
export function calculateMultiplier(betAmount: number, winnings: number): string {
  if (betAmount === 0 || winnings === 0) return "0.00x"
  return (winnings / betAmount).toFixed(2) + "x"
}

// Generate random safe tile position
export function getRandomSafeTile(grid: any[][]): { row: number; col: number } | null {
  const safeTiles: { row: number; col: number }[] = []

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (!grid[row][col].isMine && !grid[row][col].isRevealed) {
        safeTiles.push({ row, col })
      }
    }
  }

  if (safeTiles.length === 0) return null

  const randomIndex = Math.floor(Math.random() * safeTiles.length)
  return safeTiles[randomIndex]
}

// Calculate win streak bonus
export function calculateWinStreakBonus(winStreak: number): number {
  if (winStreak <= 1) return 0
  return Math.min(0.5, (winStreak - 1) * 0.05) // Max 50% bonus
}

// Calculate risk factor based on mines count
export function calculateRiskFactor(minesCount: number, totalTiles: number): string {
  const percentage = (minesCount / totalTiles) * 100

  if (percentage < 10) return "Low"
  if (percentage < 25) return "Medium"
  if (percentage < 40) return "High"
  return "Extreme"
}

// Generate a unique game ID
export function generateGameId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Calculate expected value
export function calculateExpectedValue(betAmount: number, minesCount: number, totalTiles: number): number {
  const safeTiles = totalTiles - minesCount
  const safeProb = safeTiles / totalTiles
  const mineProb = minesCount / totalTiles

  // Simplified EV calculation
  const avgWinnings = betAmount * 1.5 // Assuming average multiplier of 1.5x
  return safeProb * avgWinnings - mineProb * betAmount
}

