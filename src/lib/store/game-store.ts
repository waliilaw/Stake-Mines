import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { generateGameBoard, calculateWinnings, calculateProbability } from "@/lib/game-utils"

// Game configuration
const DEFAULT_GRID_SIZE = 5
const DEFAULT_MINES_COUNT = 5
const DEFAULT_BET_AMOUNT = 0.05
const MAX_MINES = 24
const MIN_MINES = 1

// Types
export type Tile = {
  isMine: boolean
  isRevealed: boolean
  adjacentMines: number
}

export type Position = {
  row: number
  col: number
}

export type GameState = {
  // Game configuration
  gridSize: number
  minesCount: number
  betAmount: number
  maxMines: number
  minMines: number

  // Game state
  grid: Tile[][]
  isGameStarted: boolean
  gameOver: boolean
  hasWon: boolean
  revealedCount: number
  winnings: number
  potentialWinnings: number
  lastRevealedTile: Position | null
  revealedTiles: Position[]
  minePositions: Position[]

  // Wallet state
  isWalletConnected: boolean
  walletBalance: number

  // UI state
  showGameOverModal: boolean
  showWinModal: boolean
  showHowToPlayModal: boolean
  isMuted: boolean

  // Auto play
  isAutoPlayEnabled: boolean
  isAutoPlaying: boolean
  autoPlayDelay: number
  cashoutMultiplier: number

  // Stats
  totalGamesPlayed: number
  gamesWon: number
  gamesLost: number
  totalWinnings: number
  totalLosses: number
  highestWin: number

  // Actions
  setMinesCount: (count: number) => void
  setBetAmount: (amount: number) => void
  setWalletConnected: (connected: boolean) => void
  setMuted: (muted: boolean) => void
  initializeGame: () => void
  startGame: () => void
  resetGame: () => void
  handleTileClick: (row: number, col: number) => void
  handleCashout: () => void
  toggleAutoPlay: () => void
  setCashoutMultiplier: (multiplier: number) => void
  setAutoPlayDelay: (delay: number) => void
  closeGameOverModal: () => void
  closeWinModal: () => void
  toggleHowToPlayModal: () => void

  // Computed values
  getTotalTiles: () => number
  getSafeTiles: () => number
  getWinProbability: () => number
}

// Create the store
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Game configuration
      gridSize: DEFAULT_GRID_SIZE,
      minesCount: DEFAULT_MINES_COUNT,
      betAmount: DEFAULT_BET_AMOUNT,
      maxMines: MAX_MINES,
      minMines: MIN_MINES,

      // Game state
      grid: generateGameBoard(DEFAULT_GRID_SIZE, DEFAULT_MINES_COUNT),
      isGameStarted: false,
      gameOver: false,
      hasWon: false,
      revealedCount: 0,
      winnings: 0,
      potentialWinnings: DEFAULT_BET_AMOUNT,
      lastRevealedTile: null,
      revealedTiles: [],
      minePositions: [],

      // Wallet state
      isWalletConnected: false,
      walletBalance: 10.0, // Default balance

      // UI state
      showGameOverModal: false,
      showWinModal: false,
      showHowToPlayModal: false,
      isMuted: false,

      // Auto play
      isAutoPlayEnabled: false,
      isAutoPlaying: false,
      autoPlayDelay: 500,
      cashoutMultiplier: 1.5,

      // Stats
      totalGamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalWinnings: 0,
      totalLosses: 0,
      highestWin: 0,

      // Actions
      setMinesCount: (count) => {
        const { isGameStarted, minMines, maxMines } = get()
        if (isGameStarted) return

        // Ensure mines count is within valid range
        const newCount = Math.max(minMines, Math.min(maxMines, count))
        set({ minesCount: newCount })
      },

      setBetAmount: (amount) => {
        const { isGameStarted } = get()
        if (isGameStarted) return
        set({ betAmount: amount })
      },

      setWalletConnected: (connected) => {
        set({ isWalletConnected: connected })
      },

      setMuted: (muted) => {
        set({ isMuted: muted })
      },

      initializeGame: () => {
        const { gridSize, minesCount, betAmount } = get()
        const newGrid = generateGameBoard(gridSize, minesCount)

        set({
          grid: newGrid,
          isGameStarted: false,
          gameOver: false,
          hasWon: false,
          revealedCount: 0,
          winnings: 0,
          potentialWinnings: betAmount,
          lastRevealedTile: null,
          revealedTiles: [],
          minePositions: [],
          showGameOverModal: false,
          showWinModal: false,
        })
      },

      startGame: () => {
        const { isWalletConnected, betAmount, walletBalance } = get()

        if (!isWalletConnected) {
          return
        }

        // Check if player has enough balance
        if (betAmount > walletBalance) {
          alert("Insufficient balance!")
          return
        }

        // Deduct bet amount from wallet balance
        set((state) => ({
          walletBalance: state.walletBalance - betAmount,
          totalGamesPlayed: state.totalGamesPlayed + 1,
        }))

        get().initializeGame()
        set({ isGameStarted: true })
      },

      resetGame: () => {
        get().initializeGame()
        set({ isGameStarted: false })
      },

      handleTileClick: (row, col) => {
        const { isGameStarted, gameOver, grid, revealedCount, betAmount, safeTiles, minesCount } = get()

        if (!isGameStarted || gameOver || grid[row][col].isRevealed) {
          return
        }

        const newGrid = [...grid]
        const tile = newGrid[row][col]
        tile.isRevealed = true

        set({
          lastRevealedTile: { row, col },
          revealedTiles: [...get().revealedTiles, { row, col }],
        })

        if (tile.isMine) {
          // Hit a mine - game over
          const minePositions = findMinePositions(newGrid)

          set((state) => ({
            grid: newGrid,
            gameOver: true,
            minePositions,
            showGameOverModal: true,
            gamesLost: state.gamesLost + 1,
            totalLosses: state.totalLosses + state.betAmount,
          }))
        } else {
          // Safe tile
          const newRevealedCount = revealedCount + 1

          // Calculate new winnings
          const newWinnings = calculateWinnings(betAmount, newRevealedCount, safeTiles)

          // Calculate potential winnings for next reveal
          const potentialWin = calculateWinnings(betAmount, newRevealedCount + 1, safeTiles)

          set({
            grid: newGrid,
            revealedCount: newRevealedCount,
            winnings: newWinnings,
            potentialWinnings: potentialWin,
          })

          // Check if all safe tiles are revealed (win condition)
          if (newRevealedCount === safeTiles) {
            set((state) => ({
              hasWon: true,
              gameOver: true,
              showWinModal: true,
              walletBalance: state.walletBalance + newWinnings,
              gamesWon: state.gamesWon + 1,
              totalWinnings: state.totalWinnings + newWinnings,
              highestWin: Math.max(state.highestWin, newWinnings),
            }))
          }
        }
      },

      handleCashout: () => {
        const { isGameStarted, gameOver, revealedCount, winnings } = get()

        if (!isGameStarted || gameOver || revealedCount === 0) {
          return
        }

        set((state) => ({
          gameOver: true,
          hasWon: true,
          showWinModal: true,
          walletBalance: state.walletBalance + winnings,
          gamesWon: state.gamesWon + 1,
          totalWinnings: state.totalWinnings + winnings,
          highestWin: Math.max(state.highestWin, winnings),
        }))
      },

      toggleAutoPlay: () => {
        set((state) => ({
          isAutoPlayEnabled: !state.isAutoPlayEnabled,
          isAutoPlaying: !state.isAutoPlayEnabled && state.isGameStarted && !state.gameOver,
        }))
      },

      setCashoutMultiplier: (multiplier) => {
        set({ cashoutMultiplier: multiplier })
      },

      setAutoPlayDelay: (delay) => {
        set({ autoPlayDelay: delay })
      },

      closeGameOverModal: () => {
        set({ showGameOverModal: false })
      },

      closeWinModal: () => {
        set({ showWinModal: false })
      },

      toggleHowToPlayModal: () => {
        set((state) => ({ showHowToPlayModal: !state.showHowToPlayModal }))
      },

      // Computed values
      getTotalTiles: () => {
        const { gridSize } = get()
        return gridSize * gridSize
      },

      getSafeTiles: () => {
        const { gridSize, minesCount } = get()
        return gridSize * gridSize - minesCount
      },

      getWinProbability: () => {
        const { gridSize, minesCount } = get()
        const totalTiles = gridSize * gridSize
        return calculateProbability(totalTiles, minesCount)
      },
    }),
    {
      name: "mines-game-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these values
        isMuted: state.isMuted,
        walletBalance: state.walletBalance,
        totalGamesPlayed: state.totalGamesPlayed,
        gamesWon: state.gamesWon,
        gamesLost: state.gamesLost,
        totalWinnings: state.totalWinnings,
        totalLosses: state.totalLosses,
        highestWin: state.highestWin,
      }),
    },
  ),
)

// Helper function to find all mine positions
function findMinePositions(grid: Tile[][]): Position[] {
  const positions: Position[] = []

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].isMine) {
        positions.push({ row, col })
      }
    }
  }

  return positions
}

// Selector hooks for better performance
export const useGameConfig = () =>
  useGameStore((state) => ({
    gridSize: state.gridSize,
    minesCount: state.minesCount,
    betAmount: state.betAmount,
    maxMines: state.maxMines,
    minMines: state.minMines,
    setMinesCount: state.setMinesCount,
    setBetAmount: state.setBetAmount,
  }))

export const useGameState = () =>
  useGameStore((state) => ({
    grid: state.grid,
    isGameStarted: state.isGameStarted,
    gameOver: state.gameOver,
    hasWon: state.hasWon,
    revealedCount: state.revealedCount,
    winnings: state.winnings,
    potentialWinnings: state.potentialWinnings,
    lastRevealedTile: state.lastRevealedTile,
    revealedTiles: state.revealedTiles,
    minePositions: state.minePositions,
    totalTiles: state.getTotalTiles(),
    safeTiles: state.getSafeTiles(),
    winProbability: state.getWinProbability(),
  }))

export const useGameActions = () =>
  useGameStore((state) => ({
    initializeGame: state.initializeGame,
    startGame: state.startGame,
    resetGame: state.resetGame,
    handleTileClick: state.handleTileClick,
    handleCashout: state.handleCashout,
  }))

export const useWalletState = () =>
  useGameStore((state) => ({
    isWalletConnected: state.isWalletConnected,
    walletBalance: state.walletBalance,
    setWalletConnected: state.setWalletConnected,
  }))

export const useUIState = () =>
  useGameStore((state) => ({
    showGameOverModal: state.showGameOverModal,
    showWinModal: state.showWinModal,
    showHowToPlayModal: state.showHowToPlayModal,
    isMuted: state.isMuted,
    closeGameOverModal: state.closeGameOverModal,
    closeWinModal: state.closeWinModal,
    toggleHowToPlayModal: state.toggleHowToPlayModal,
    setMuted: state.setMuted,
  }))

export const useAutoPlayState = () =>
  useGameStore((state) => ({
    isAutoPlayEnabled: state.isAutoPlayEnabled,
    isAutoPlaying: state.isAutoPlaying,
    autoPlayDelay: state.autoPlayDelay,
    cashoutMultiplier: state.cashoutMultiplier,
    toggleAutoPlay: state.toggleAutoPlay,
    setCashoutMultiplier: state.setCashoutMultiplier,
    setAutoPlayDelay: state.setAutoPlayDelay,
  }))

export const useGameStats = () =>
  useGameStore((state) => ({
    totalGamesPlayed: state.totalGamesPlayed,
    gamesWon: state.gamesWon,
    gamesLost: state.gamesLost,
    totalWinnings: state.totalWinnings,
    totalLosses: state.totalLosses,
    highestWin: state.highestWin,
  }))

