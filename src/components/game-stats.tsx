"use client"

import { motion } from "framer-motion"
import { BarChart, Trophy, TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"
import useGameAnalytics from "@/lib/hooks/use-game-analytics"
import { formatCurrency } from "@/lib/game-utils"

export default function GameStats() {
  const { totalGamesPlayed, gamesWon, gamesLost, totalWinnings, totalLosses, highestWin, winRate, netProfit } =
    useGameAnalytics()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full bg-card rounded-xl p-6 shadow-lg mt-6 neon-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2 neon-text">
          <BarChart className="w-5 h-5" />
          Game Statistics
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1">Games Played</div>
          <div className="text-xl font-bold text-primary">{totalGamesPlayed}</div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            <span>Win Rate</span>
          </div>
          <div className="text-xl font-bold text-primary">{winRate.toFixed(1)}%</div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Image src="/images/diamond.png" alt="Diamond" width={16} height={16} className="w-4 h-4 object-contain" />
            <span>Highest Win</span>
          </div>
          <div className="text-xl font-bold text-primary">{formatCurrency(highestWin)} ETH</div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            {netProfit >= 0 ? (
              <TrendingUp className="w-4 h-4 text-primary" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span>Net Profit</span>
          </div>
          <div className={`text-xl font-bold ${netProfit >= 0 ? "text-primary" : "text-destructive"}`}>
            {formatCurrency(netProfit)} ETH
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-2">Win/Loss Ratio</div>
          <div className="h-4 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${winRate}%` }}></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Wins: {gamesWon}</span>
            <span>Losses: {gamesLost}</span>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-2">Profit/Loss</div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">Winnings</div>
              <div className="text-sm font-medium text-primary">{formatCurrency(totalWinnings)} ETH</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">Losses</div>
              <div className="text-sm font-medium text-destructive">{formatCurrency(totalLosses)} ETH</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

