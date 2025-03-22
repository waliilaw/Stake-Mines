"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Minus, Plus, Bomb, Coins } from "lucide-react"

interface BetPanelProps {
  betAmount: number
  setBetAmount: (amount: number) => void
  minesCount: number
  setMinesCount: (count: number) => void
  isGameStarted: boolean
  maxMines: number
  minMines: number
}

export default function BetPanel({
  betAmount,
  setBetAmount,
  minesCount,
  setMinesCount,
  isGameStarted,
  maxMines,
  minMines,
}: BetPanelProps) {
  const [isCustomBetOpen, setIsCustomBetOpen] = useState(false)
  const [customBetInput, setCustomBetInput] = useState("")

  // Predefined bet amounts
  const betOptions = [0.01, 0.05, 0.1, 0.5, 1]

  // Handle bet amount change
  const handleBetAmountChange = (amount: number) => {
    if (isGameStarted) return
    setBetAmount(amount)
  }

  // Handle mines count change
  const handleMinesCountChange = (count: number) => {
    if (isGameStarted) return

    // Ensure mines count is within valid range
    const newCount = Math.max(minMines, Math.min(maxMines, count))
    setMinesCount(newCount)
  }

  // Handle custom bet input
  const handleCustomBetSubmit = () => {
    const amount = Number.parseFloat(customBetInput)
    if (!isNaN(amount) && amount > 0) {
      setBetAmount(amount)
      setIsCustomBetOpen(false)
      setCustomBetInput("")
    }
  }

  return (
    <div className="bg-secondary rounded-lg p-4 shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-2">
          <Coins className="w-5 h-5" />
          Bet Amount
        </h3>

        <div className="flex flex-wrap gap-2">
          {betOptions.map((amount) => (
            <motion.button
              key={amount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-3 py-2 rounded-md text-sm font-medium
                ${betAmount === amount ? "bg-accent text-primary" : "bg-primary/20 text-primary"}
                ${isGameStarted ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/30"}
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
              px-3 py-2 rounded-md text-sm font-medium bg-primary/20 text-primary
              ${isGameStarted ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/30"}
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
              className="flex-1 px-3 py-2 rounded-md bg-primary/10 text-primary border border-primary/20 focus:outline-none focus:ring-2 focus:ring-accent"
              step="0.01"
              min="0.01"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 rounded-md bg-accent text-primary font-medium"
              onClick={handleCustomBetSubmit}
            >
              Set
            </motion.button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-2">
          <Bomb className="w-5 h-5" />
          Mines Count
        </h3>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-10 h-10 rounded-md bg-primary/20 text-primary flex items-center justify-center
              ${isGameStarted ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/30"}
            `}
            onClick={() => handleMinesCountChange(minesCount - 1)}
            disabled={isGameStarted || minesCount <= minMines}
          >
            <Minus className="w-5 h-5" />
          </motion.button>

          <div className="flex-1 text-center bg-primary/10 py-2 rounded-md font-bold text-primary">
            {minesCount} Mines
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-10 h-10 rounded-md bg-primary/20 text-primary flex items-center justify-center
              ${isGameStarted ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/30"}
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
                px-2 py-1 rounded-md text-xs font-medium
                ${minesCount === count ? "bg-accent text-primary" : "bg-primary/20 text-primary"}
                ${isGameStarted ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/30"}
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

