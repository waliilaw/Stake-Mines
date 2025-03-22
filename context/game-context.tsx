"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

// Tile types
type TileState = "unrevealed" | "safe" | "mine"
type Tile = {
  state: TileState
  value: number
}

// Difficulty settings
type Difficulty = "easy" | "medium" | "hard"
type DifficultySettings = {
  gridSize: number
  mineCount: number
}

// Game context type
type GameContextType = {
  grid: Tile[][]
  isGameStarted: boolean
  gameOver: boolean
  gameWon: boolean
  winnings: number
  betAmount: number
  revealedCount: number
  totalSafeTiles: number
  mineCount: number
  difficulty: Difficulty
  setDifficulty: (difficulty: Difficulty) => void
  setBetAmount: (amount: number) => void
  startGame: () => void
  resetGame: () => void
  handleTileClick: (row: number, col: number) => void
  cashOut: () => void
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined)

// Difficulty settings map
const difficultySettings: Record<Difficulty, DifficultySettings> = {
  easy: { gridSize: 5, mineCount: 5 },
  medium: { gridSize: 7, mineCount: 10 },
  hard: { gridSize: 10, mineCount: 20 },
}

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [grid, setGrid] = useState<Tile[][]>([])
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [winnings, setWinnings] = useState(0)
  const [betAmount, setBetAmount] = useState(1)
  const [revealedCount, setRevealedCount] = useState(0)
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const { toast } = useToast()

  // Get current difficulty settings
  const currentSettings = difficultySettings[difficulty]
  const totalSafeTiles = currentSettings.gridSize * currentSettings.gridSize - currentSettings.mineCount

  // Initialize grid
  useEffect(() => {
    resetGame()
  }, [difficulty])

  // Create a new grid
  const createGrid = () => {
    const { gridSize } = currentSettings
    const newGrid: Tile[][] = []

    for (let i = 0; i < gridSize; i++) {
      const row: Tile[] = []
      for (let j = 0; j < gridSize; j++) {
        row.push({
          state: "unrevealed",
          value: 0, // 0 for safe, 1 for mine
        })
      }
      newGrid.push(row)
    }

    return newGrid
  }

  // Place mines randomly on the grid
  const placeMines = (grid: Tile[][]) => {
    const { gridSize, mineCount } = currentSettings
    const newGrid = JSON.parse(JSON.stringify(grid))
    let minesPlaced = 0

    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * gridSize)
      const col = Math.floor(Math.random() * gridSize)

      if (newGrid[row][col].value === 0) {
        newGrid[row][col].value = 1
        minesPlaced++
      }
    }

    return newGrid
  }

  // Start the game
  const startGame = () => {
    if (betAmount <= 0) {
      toast({
        title: "Invalid Bet",
        description: "Please enter a valid bet amount.",
        variant: "destructive",
      })
      return
    }

    const newGrid = placeMines(createGrid())
    setGrid(newGrid)
    setIsGameStarted(true)
    setGameOver(false)
    setGameWon(false)
    setWinnings(0)
    setRevealedCount(0)

    toast({
      title: "Game Started!",
      description: "Click on tiles to reveal diamonds. Avoid mines!",
    })
  }

  // Reset the game
  const resetGame = () => {
    const newGrid = createGrid()
    setGrid(newGrid)
    setIsGameStarted(false)
    setGameOver(false)
    setGameWon(false)
    setWinnings(0)
    setRevealedCount(0)
  }

  // Handle tile click
  const handleTileClick = (row: number, col: number) => {
    if (!isGameStarted || gameOver || grid[row][col].state !== "unrevealed") {
      return
    }

    const newGrid = [...grid]
    const tile = newGrid[row][col]

    if (tile.value === 1) {
      // Hit a mine
      tile.state = "mine"
      setGameOver(true)
      setGameWon(false)

      // Reveal all mines
      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[i].length; j++) {
          if (newGrid[i][j].value === 1) {
            newGrid[i][j].state = "mine"
          }
        }
      }

      toast({
        title: "Boom! You hit a mine!",
        description: `Game over. Your winnings: ${winnings.toFixed(2)}`,
        variant: "destructive",
      })
    } else {
      // Safe tile
      tile.state = "safe"
      const newRevealedCount = revealedCount + 1
      setRevealedCount(newRevealedCount)

      // Calculate new winnings (multiplier increases with each safe tile)
      const multiplier = 1 + newRevealedCount * 0.2
      const newWinnings = betAmount * multiplier
      setWinnings(newWinnings)

      // Check if all safe tiles are revealed
      if (newRevealedCount === totalSafeTiles) {
        setGameOver(true)
        setGameWon(true)
        toast({
          title: "Congratulations!",
          description: `You found all diamonds! Your winnings: ${newWinnings.toFixed(2)}`,
          variant: "success",
        })
      }
    }

    setGrid(newGrid)
  }

  // Cash out
  const cashOut = () => {
    if (!isGameStarted || gameOver) {
      return
    }

    setGameOver(true)
    setGameWon(true)
    toast({
      title: "Cashed Out!",
      description: `You've secured ${winnings.toFixed(2)} in winnings!`,
      variant: "success",
    })
  }

  const value = {
    grid,
    isGameStarted,
    gameOver,
    gameWon,
    winnings,
    betAmount,
    revealedCount,
    totalSafeTiles,
    mineCount: currentSettings.mineCount,
    difficulty,
    setDifficulty,
    setBetAmount,
    startGame,
    resetGame,
    handleTileClick,
    cashOut,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

