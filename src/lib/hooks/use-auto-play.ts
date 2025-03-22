"use client"

import { useEffect, useCallback } from "react"
import { useGameState, useGameActions, useAutoPlayState } from "@/lib/store/game-store"
import { getRandomSafeTile } from "@/lib/game-utils"

export default function useAutoPlay() {
  const { grid, isGameStarted, gameOver, winnings, potentialWinnings } = useGameState()
  const { handleTileClick, handleCashout } = useGameActions()
  const { isAutoPlayEnabled, isAutoPlaying, autoPlayDelay, cashoutMultiplier } = useAutoPlayState()

  const performAutoPlay = useCallback(() => {
    if (!isGameStarted || gameOver) return

    // Find a random safe tile
    const safeTile = getRandomSafeTile(grid)

    if (safeTile) {
      handleTileClick(safeTile.row, safeTile.col)
    } else {
      // No more safe tiles to reveal, cash out
      handleCashout()
    }
  }, [grid, isGameStarted, gameOver, handleTileClick, handleCashout])

  // Auto play logic
  useEffect(() => {
    let autoPlayInterval: NodeJS.Timeout | null = null

    if (isAutoPlayEnabled && isAutoPlaying && isGameStarted && !gameOver) {
      autoPlayInterval = setInterval(() => {
        // Check if we've reached the cashout multiplier
        if (winnings >= potentialWinnings * cashoutMultiplier) {
          handleCashout()
          return
        }

        performAutoPlay()
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
    winnings,
    potentialWinnings,
    cashoutMultiplier,
    autoPlayDelay,
    handleCashout,
    performAutoPlay,
  ])

  return {
    performAutoPlay,
  }
}

