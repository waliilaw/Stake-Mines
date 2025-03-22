"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Trophy, TrendingUp } from "lucide-react"
import { useGameState } from "@/lib/store/game-store"
import { formatCurrency, calculateMultiplier } from "@/lib/game-utils"

export default function Scoreboard() {
  const { betAmount, winnings, potentialWinnings, minesCount, revealedCount, safeTiles, winProbability } =
    useGameState()

  return (
    <div className="bg-card rounded-lg p-4 shadow-md neon-border">
      <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2 neon-text">
        <Trophy className="w-5 h-5" />
        Scoreboard
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1">Bet Amount</div>
          <div className="text-xl font-bold text-primary flex items-center gap-1">
            <Image src="/images/dollar.png" alt="$" width={20} height={20} className="w-5 h-5 object-contain" />
            {formatCurrency(betAmount)} ETH
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1">Current Winnings</div>
          <motion.div
            key={winnings}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-xl font-bold text-primary flex items-center gap-1"
          >
            <Image src="/images/dollar.png" alt="$" width={20} height={20} className="w-5 h-5 object-contain" />
            {formatCurrency(winnings)} ETH
          </motion.div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Image src="/images/diamond.png" alt="Diamond" width={16} height={16} className="w-4 h-4 object-contain" />
            <span>Safe Tiles</span>
          </div>
          <div className="text-xl font-bold text-primary">
            {revealedCount} / {safeTiles}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <Image src="/images/bomb.png" alt="Bomb" width={16} height={16} className="w-4 h-4 object-contain" />
            <span>Mines</span>
          </div>
          <div className="text-xl font-bold text-primary">{minesCount}</div>
        </div>

        <div className="bg-muted rounded-lg p-3 col-span-2">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>Next Tile Potential</span>
          </div>
          <motion.div
            key={potentialWinnings}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-xl font-bold text-primary flex items-center gap-1"
          >
            <Image src="/images/dollar.png" alt="$" width={20} height={20} className="w-5 h-5 object-contain" />
            {formatCurrency(potentialWinnings)} ETH
            <span className="text-sm font-normal text-accent ml-2">
              ({calculateMultiplier(betAmount, potentialWinnings)})
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

