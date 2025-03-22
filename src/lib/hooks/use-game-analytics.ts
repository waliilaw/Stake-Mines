"use client"

import { useEffect } from "react"
import { useGameStats, useGameState } from "@/lib/store/game-store"

export default function useGameAnalytics() {
  const { totalGamesPlayed, gamesWon, gamesLost, totalWinnings, totalLosses, highestWin } = useGameStats()

  const { gameOver, hasWon } = useGameState()

  // Log game analytics
  useEffect(() => {
    if (gameOver) {
      console.log("Game Analytics:", {
        totalGamesPlayed,
        gamesWon,
        gamesLost,
        winRate: totalGamesPlayed > 0 ? (gamesWon / totalGamesPlayed) * 100 : 0,
        totalWinnings,
        totalLosses,
        netProfit: totalWinnings - totalLosses,
        highestWin,
        lastGameResult: hasWon ? "Win" : "Loss",
      })
    }
  }, [gameOver, hasWon, totalGamesPlayed, gamesWon, gamesLost, totalWinnings, totalLosses, highestWin])

  const getWinRate = () => {
    return totalGamesPlayed > 0 ? (gamesWon / totalGamesPlayed) * 100 : 0
  }

  const getNetProfit = () => {
    return totalWinnings - totalLosses
  }

  return {
    totalGamesPlayed,
    gamesWon,
    gamesLost,
    totalWinnings,
    totalLosses,
    highestWin,
    winRate: getWinRate(),
    netProfit: getNetProfit(),
  }
}

