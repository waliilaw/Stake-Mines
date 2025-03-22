"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, RotateCcw, Play } from "lucide-react"
import GameBoard from "./game-board"
import Scoreboard from "./scoreboard"
import BetPanel from "./bet-panel"
import GameHeader from "./game-header"
import GameFooter from "./game-footer"
import ConnectWalletButton from "./connect-wallet-button"
import GameOverModal from "./game-over-modal"
import WinModal from "./win-modal"
import HowToPlayModal from "./how-to-play-modal"
import useSound from "./hooks/use-sound"
import { generateGameBoard, calculateWinnings, calculateProbability } from "../lib/game-utils"

// Game configuration
const DEFAULT_GRID_SIZE = 5
const DEFAULT_MINES_COUNT = 5
const DEFAULT_BET_AMOUNT = 0.05
const MAX_MINES = 24
const MIN_MINES = 1

export default function MinesGame() {
  // Game state
  const [grid, setGrid] = useState<Array<Array<{ isMine: boolean; isRevealed: boolean; adjacentMines: number }>>>([])
  const [minesCount, setMinesCount] = useState(DEFAULT_MINES_COUNT)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [revealedCount, setRevealedCount] = useState(0)
  const [betAmount, setBetAmount] = useState(DEFAULT_BET_AMOUNT)
  const [winnings, setWinnings] = useState(0)
  const [potentialWinnings, setPotentialWinnings] = useState(0)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [showWinModal, setShowWinModal] = useState(false)
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [lastRevealedTile, setLastRevealedTile] = useState<{ row: number; col: number } | null>(null)
  const [revealedTiles, setRevealedTiles] = useState<Array<{ row: number; col: number }>>([])
  const [minePositions, setMinePositions] = useState<Array<{ row: number; col: number }>>([])
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [autoPlayDelay, setAutoPlayDelay] = useState(500)
  const [cashoutMultiplier, setCashoutMultiplier] = useState(1.5)

  // Sound effects
  const {
    playClickSound,
    playDiamondSound,
    playBombSound,
    playCashoutSound,
    playStartGameSound,
    playWinSound,
    playLoseSound,
    soundsEnabled,
  } = useSound(isMuted)

  // Calculate total tiles and safe tiles
  const totalTiles = DEFAULT_GRID_SIZE * DEFAULT_GRID_SIZE
  const safeTiles = totalTiles - minesCount

  // Calculate win probability
  const winProbability = useMemo(() => {
    return calculateProbability(totalTiles, minesCount)
  }, [totalTiles, minesCount])

  // Initialize game board
  const initializeGame = useCallback(() => {
    const newGrid = generateGameBoard(DEFAULT_GRID_SIZE, minesCount)
    setGrid(newGrid)
    setIsGameStarted(false)
    setGameOver(false)
    setHasWon(false)
    setRevealedCount(0)
    setWinnings(0)
    setPotentialWinnings(betAmount)
    setLastRevealedTile(null)
    setRevealedTiles([])
    setMinePositions([])
    setShowGameOverModal(false)
    setShowWinModal(false)
    playStartGameSound()
  }, [minesCount, betAmount, playStartGameSound])

  // Start game
  const startGame = useCallback(() => {
    if (!isWalletConnected) {
      alert("Please connect your wallet first!")
      return
    }

    initializeGame()
    setIsGameStarted(true)
    playStartGameSound()
  }, [isWalletConnected, initializeGame, playStartGameSound])

  // Reset game
  const resetGame = useCallback(() => {
    initializeGame()
    setIsGameStarted(false)
  }, [initializeGame])

  // Handle tile click
  const handleTileClick = useCallback(
    (row: number, col: number) => {
      if (!isGameStarted || gameOver || grid[row][col].isRevealed) {
        return
      }

      playClickSound()

      const newGrid = [...grid]
      const tile = newGrid[row][col]
      tile.isRevealed = true

      setLastRevealedTile({ row, col })
      setRevealedTiles((prev) => [...prev, { row, col }])

      if (tile.isMine) {
        // Hit a mine
        setGameOver(true)
        setMinePositions(findMinePositions(newGrid))
        setShowGameOverModal(true)
        playBombSound()
        playLoseSound()
      } else {
        // Safe tile
        playDiamondSound()
        const newRevealedCount = revealedCount + 1
        setRevealedCount(newRevealedCount)

        // Calculate new winnings
        const newWinnings = calculateWinnings(betAmount, newRevealedCount, safeTiles)
        setWinnings(newWinnings)

        // Calculate potential winnings for next reveal
        const potentialWin = calculateWinnings(betAmount, newRevealedCount + 1, safeTiles)
        setPotentialWinnings(potentialWin)

        // Check if all safe tiles are revealed (win condition)
        if (newRevealedCount === safeTiles) {
          setHasWon(true)
          setGameOver(true)
          setShowWinModal(true)
          playCashoutSound()
          playWinSound()
        }
      }

      setGrid(newGrid)
    },
    [
      isGameStarted,
      gameOver,
      grid,
      revealedCount,
      safeTiles,
      betAmount,
      playClickSound,
      playBombSound,
      playDiamondSound,
      playCashoutSound,
      playLoseSound,
      playWinSound,
    ],
  )

  // Find all mine positions
  const findMinePositions = (grid: any[][]) => {
    const positions: Array<{ row: number; col: number }> = []

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].isMine) {
          positions.push({ row, col })
        }
      }
    }

    return positions
  }

  // Handle cashout
  const handleCashout = useCallback(() => {
    if (!isGameStarted || gameOver || revealedCount === 0) {
      return
    }

    playCashoutSound()
    setGameOver(true)
    setHasWon(true)
    setShowWinModal(true)
  }, [isGameStarted, gameOver, revealedCount, playCashoutSound])

  // Auto play logic
  useEffect(() => {
    let autoPlayInterval: NodeJS.Timeout | null = null

    if (isAutoPlayEnabled && isAutoPlaying && isGameStarted && !gameOver) {
      autoPlayInterval = setInterval(() => {
        // Find all unrevealed safe tiles
        const unrevealedSafeTiles: Array<{ row: number; col: number }> = []

        for (let row = 0; row < grid.length; row++) {
          for (let col = 0; col < grid[row].length; col++) {
            if (!grid[row][col].isRevealed && !grid[row][col].isMine) {
              unrevealedSafeTiles.push({ row, col })
            }
          }
        }

        // If there are unrevealed safe tiles, reveal a random one
        if (unrevealedSafeTiles.length > 0) {
          const randomIndex = Math.floor(Math.random() * unrevealedSafeTiles.length)
          const { row, col } = unrevealedSafeTiles[randomIndex]
          handleTileClick(row, col)
        } else {
          // No more safe tiles to reveal, stop auto play
          setIsAutoPlaying(false)
        }

        // Check if we've reached the cashout multiplier
        if (winnings >= betAmount * cashoutMultiplier) {
          handleCashout()
          setIsAutoPlaying(false)
        }
      }, autoPlayDelay)
    }

    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval)
      }
    }
  }, [
    isAutoPlayEnabled,
    isAutoPlaying,
    isGameStarted,
    gameOver,
    grid,
    handleTileClick,
    winnings,
    betAmount,
    cashoutMultiplier,
    handleCashout,
    autoPlayDelay,
  ])

  // Initialize game on component mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // Update potential winnings when bet amount or mines count changes
  useEffect(() => {
    const potentialWin = calculateWinnings(betAmount, revealedCount + 1, safeTiles)
    setPotentialWinnings(potentialWin)
  }, [betAmount, minesCount, revealedCount, safeTiles])

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      <GameHeader
        isWalletConnected={isWalletConnected}
        setIsWalletConnected={setIsWalletConnected}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onHowToPlay={() => setShowHowToPlayModal(true)}
        soundsEnabled={soundsEnabled}
      />

      <div className="w-full bg-primary rounded-xl p-6 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Scoreboard
              betAmount={betAmount}
              winnings={winnings}
              potentialWinnings={potentialWinnings}
              minesCount={minesCount}
              revealedCount={revealedCount}
              safeTiles={safeTiles}
              winProbability={winProbability}
            />

            <div className="mt-4 flex flex-col gap-2">
              <BetPanel
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                minesCount={minesCount}
                setMinesCount={setMinesCount}
                isGameStarted={isGameStarted}
                maxMines={MAX_MINES}
                minMines={MIN_MINES}
              />

              <div className="flex gap-2 mt-4">
                {!isGameStarted ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-accent text-primary font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    onClick={startGame}
                  >
                    <Play className="w-5 h-5" />
                    Start Game
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-accent text-primary font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                      onClick={handleCashout}
                      disabled={gameOver || revealedCount === 0}
                    >
                      <Trophy className="w-5 h-5" />
                      Cash Out
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-secondary text-primary font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                      onClick={resetGame}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <GameBoard
              grid={grid}
              onTileClick={handleTileClick}
              gameOver={gameOver}
              lastRevealedTile={lastRevealedTile}
              revealedTiles={revealedTiles}
              minePositions={minePositions}
            />
          </div>
        </div>
      </div>

      <GameFooter />

      <AnimatePresence>
        {showGameOverModal && (
          <GameOverModal
            onClose={() => setShowGameOverModal(false)}
            onPlayAgain={resetGame}
            betAmount={betAmount}
            minesCount={minesCount}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWinModal && (
          <WinModal
            onClose={() => setShowWinModal(false)}
            onPlayAgain={resetGame}
            winnings={winnings}
            betAmount={betAmount}
            revealedCount={revealedCount}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHowToPlayModal && <HowToPlayModal onClose={() => setShowHowToPlayModal(false)} />}
      </AnimatePresence>

      {!isWalletConnected && (
        <div className="fixed bottom-4 right-4">
          <ConnectWalletButton isConnected={isWalletConnected} onConnect={() => setIsWalletConnected(true)} />
        </div>
      )}
    </div>
  )
}

