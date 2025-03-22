"use client"

import { motion } from "framer-motion"
import { Bomb, Diamond, Trophy, TrendingUp } from "lucide-react"

interface ScoreboardProps {
  betAmount: number
  winnings: number
  potentialWinnings: number
  minesCount: number
  revealedCount: number
  safeTiles: number
  winProbability: number
}

export default function Scoreboard({
  betAmount,
  winnings,
  potentialWinnings,
  minesCount,
  revealedCount,
  safeTiles,
  winProbability,
}: ScoreboardProps) {
  return (
    <div className="bg-secondary rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        Scoreboard
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary/20 rounded-lg p-3">
          <div className="text-sm text-primary/70 mb-1">Bet Amount</div>
          <div className="text-xl font-bold text-primary">{betAmount.toFixed(2)} ETH</div>
        </div>

        <div className="bg-primary/20 rounded-lg p-3">
          <div className="text-sm text-primary/70 mb-1">Current Winnings</div>
          <motion.div
            key={winnings}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-xl font-bold text-primary"
          >
            {winnings.toFixed(2)} ETH
          </motion.div>
        </div>

        <div className="bg-primary/20 rounded-lg p-3">
          <div className="text-sm text-primary/70 mb-1 flex items-center gap-1">
            <Diamond className="w-4 h-4" />
            <span>Safe Tiles</span>
          </div>
          <div className="text-xl font-bold text-primary">
            {revealedCount} / {safeTiles}
          </div>
        </div>

        <div className="bg-primary/20 rounded-lg p-3">
          <div className="text-sm text-primary/70 mb-1 flex items-center gap-1">
            <Bomb className="w-4 h-4" />
            <span>Mines</span>
          </div>
          <div className="text-xl font-bold text-primary">{minesCount}</div>
        </div>

        <div className="bg-primary/20 rounded-lg p-3 col-span-2">
          <div className="text-sm text-primary/70 mb-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>Next Tile Potential</span>
          </div>
          <motion.div
            key={potentialWinnings}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-xl font-bold text-primary"
          >
            {potentialWinnings.toFixed(2)} ETH
          </motion.div>
        </div>
      </div>
    </div>
  )
}

