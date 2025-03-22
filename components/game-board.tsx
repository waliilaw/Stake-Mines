"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Tile from "@/components/tile"
import { useGame } from "@/context/game-context"
import { useToast } from "@/hooks/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

interface GameBoardProps {
  setCursorVariant: (variant: string) => void
}

export default function GameBoard({ setCursorVariant }: GameBoardProps) {
  const {
    grid,
    isGameStarted,
    gameOver,
    winnings,
    revealedCount,
    totalSafeTiles,
    handleTileClick,
    difficulty,
    gameWon,
  } = useGame()

  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const boardRef = useRef<HTMLDivElement>(null)

  // Calculate grid size based on screen size and difficulty
  const getTileSize = () => {
    if (isMobile) return "h-10 w-10"
    if (isTablet) return "h-12 w-12"
    return "h-16 w-16"
  }

  const tileSize = getTileSize()

  // Animation variants for the game board
  const boardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.03,
      },
    },
  }

  // Animation variants for individual tiles
  const tileVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  // Effect to show toast messages based on game state
  useEffect(() => {
    if (gameOver && !gameWon) {
      toast({
        title: "Game Over!",
        description: `You hit a mine! Your winnings: ${winnings.toFixed(2)}`,
        variant: "destructive",
      })
    } else if (gameWon) {
      toast({
        title: "Congratulations!",
        description: `You cleared all safe tiles! Your winnings: ${winnings.toFixed(2)}`,
        variant: "success",
      })

      // Trigger confetti animation
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2

        confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
          colors: ["#2dd4bf", "#f59e0b", "#10b981"],
        })
      }
    }
  }, [gameOver, gameWon, winnings, toast])

  // Get grid size based on difficulty
  const getGridSize = () => {
    switch (difficulty) {
      case "easy":
        return "grid-cols-5"
      case "medium":
        return "grid-cols-7"
      case "hard":
        return "grid-cols-10"
      default:
        return "grid-cols-5"
    }
  }

  // Handle hover events for cursor
  const handleMouseEnter = () => {
    setCursorVariant("hover")
  }

  const handleMouseLeave = () => {
    setCursorVariant("default")
  }

  return (
    <div
      className="flex flex-col items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={boardRef}
    >
      <motion.div
        className={cn(
          "grid gap-2 p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-teal-900/50 shadow-glow relative",
          getGridSize(),
        )}
        variants={boardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Grid overlay effect */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-xl pointer-events-none"></div>

        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <motion.div key={`${rowIndex}-${colIndex}`} variants={tileVariants} layout>
              <Tile
                state={tile.state}
                value={tile.value}
                onClick={() => handleTileClick(rowIndex, colIndex)}
                disabled={!isGameStarted || gameOver || tile.state !== "unrevealed"}
                position={[rowIndex, colIndex]}
                className={tileSize}
              />
            </motion.div>
          )),
        )}

        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-transparent to-amber-500/20 rounded-xl blur-sm -z-10"></div>
      </motion.div>

      {!isGameStarted && (
        <motion.div
          className="mt-8 text-center bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-teal-900/50 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-crypto mb-3 text-teal-400">Ready to Start Mining?</h3>
          <p className="text-slate-300 mb-2">Select difficulty and place your bet to begin your adventure!</p>
          <p className="text-sm text-slate-400">Reveal diamonds to win, but watch out for mines!</p>
        </motion.div>
      )}
    </div>
  )
}

