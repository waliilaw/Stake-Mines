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
  let multiplier = 1 + progressRatio * 2

  // Apply exponential growth for higher revealed counts
  if (revealedCount > safeTiles / 2) {
    multiplier += Math.pow(progressRatio, 2)
  }

  return betAmount * multiplier
}

// Calculate win probability
export function calculateProbability(totalTiles: number, minesCount: number) {
  const safeTiles = totalTiles - minesCount
  return (safeTiles / totalTiles) * 100
}

