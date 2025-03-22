"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Minus, Plus } from "lucide-react"
import Image from "next/image"
import { useGameConfig, useGameState } from "@/lib/store/game-store"
import useSound from "@/lib/hooks/use-sound"

export default function BetPanel() {
  const { betAmount, minesCount, maxMines, minMines, setBetAmount, setMinesCount } = useGameConfig()

  const { isGameStarted } = useGameState()
  const [isCustomBetOpen, setIsCustomBetOpen] = useState(false)
  const [customBetInput, setCustomBetInput] = useState("")
  const { playButtonSound } = useSound()

  // Predefined bet amounts
  const betOptions = [0.01, 0.05, 0.1, 0.5, 1]

  // Handle bet amount change
  const handleBetAmountChange = (amount: number) => {
    if (isGameStarted) return
    setBetAmount(amount)
    playButtonSound()
  }

  // Handle mines count change
  const handleMinesCountChange = (count: number) => {
    if (isGameStarted) return

    // Ensure mines count is within valid range
    const newCount = Math.max(minMines, Math.min(maxMines, count))
    setMinesCount(newCount)
    playButtonSound()
  }

  // Handle custom bet input
  const handleCustomBetSubmit = () => {
    const amount = Number.parseFloat(customBetInput)
    if (!isNaN(amount) && amount > 0) {
      setBetAmount(amount)
      setIsCustomBetOpen(false)
      setCustomBetInput("")
      playButtonSound()
    }
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-md neon-border">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-2 neon-text">
          <Image src="/images/dollar.png" alt="$" width={20} height={20} className="w-5 h-5 object-contain" />
          <span>Bet Amount</span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {betOptions.map((amount) => (
            <motion.button
              key={amount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                cartoon-button px-3 py-2 rounded-md text-sm font-medium
                ${betAmount === amount ? "bg-accent text-primary" : "bg-muted text-primary"}
                ${isGameStarted ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => handleBetAmountChange(amount)}
              disabled={isGameStarted}
            >
              {amount} ETH
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              cartoon-button px-3 py-2 rounded-md text-sm font-medium bg-muted text-primary
              ${isGameStarted ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={() => setIsCustomBetOpen(true)}
            disabled={isGameStarted}
          >
            Custom
          </motion.button>
        </div>

        {isCustomBetOpen && (
          <div className="mt-2 flex gap-2">
            <input
              type="number"
              value={customBetInput}
              onChange={(e) => setCustomBetInput(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 px-3 py-2 rounded-md bg-muted text-primary border border-primary/20 focus:outline-none focus:ring-2 focus:ring-accent"
              step="0.01"
              min="0.01"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cartoon-button px-3 py-2 rounded-md bg-accent text-primary font-medium"
              onClick={handleCustomBetSubmit}
            >
              Set
            </motion.button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-2 neon-text">
          <Image src="/images/bomb.png" alt="Bomb" width={20} height={20} className="w-5 h-5 object-contain" />
          <span>Mines Count</span>
        </h3>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              cartoon-button w-10 h-10 rounded-md bg-muted text-primary flex items-center justify-center
              ${isGameStarted ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={() => handleMinesCountChange(minesCount - 1)}
            disabled={isGameStarted || minesCount <= minMines}
          >
            <Minus className="w-5 h-5" />
          </motion.button>

          <div className="flex-1 text-center bg-muted py-2 rounded-md font-bold text-primary">{minesCount} Mines</div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              cartoon-button w-10 h-10 rounded-md bg-muted text-primary flex items-center justify-center
              ${isGameStarted ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={() => handleMinesCountChange(minesCount + 1)}
            disabled={isGameStarted || minesCount >= maxMines}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-5 gap-1 mt-2">
          {[1, 3, 5, 10, 15].map((count) => (
            <motion.button
              key={count}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                cartoon-button px-2 py-1 rounded-md text-xs font-medium
                ${minesCount === count ? "bg-accent text-primary" : "bg-muted text-primary"}
                ${isGameStarted ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => handleMinesCountChange(count)}
              disabled={isGameStarted}
            >
              {count}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

