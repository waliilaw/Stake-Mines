"use client"

import { motion } from "framer-motion"
import { Trophy, RotateCcw } from "lucide-react"

interface WinModalProps {
  onClose: () => void
  onPlayAgain: () => void
  winnings: number
  betAmount: number
  revealedCount: number
}

export default function WinModal({ onClose, onPlayAgain, winnings, betAmount, revealedCount }: WinModalProps) {
  const profit = winnings - betAmount
  const multiplier = winnings / betAmount

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-secondary rounded-xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-4"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold text-primary mb-2">Congratulations!</h2>

          <p className="text-primary/70 mb-6">You successfully cashed out and won {winnings.toFixed(2)} ETH!</p>

          <div className="bg-primary/10 rounded-lg p-4 mb-6 w-full">
            <div className="text-sm text-primary/70 mb-1">Game Stats</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-primary/70">Bet Amount</div>
                <div className="text-lg font-bold text-primary">{betAmount.toFixed(2)} ETH</div>
              </div>
              <div>
                <div className="text-sm text-primary/70">Profit</div>
                <div className="text-lg font-bold text-primary">{profit.toFixed(2)} ETH</div>
              </div>
              <div>
                <div className="text-sm text-primary/70">Multiplier</div>
                <div className="text-lg font-bold text-primary">{multiplier.toFixed(2)}x</div>
              </div>
              <div>
                <div className="text-sm text-primary/70">Tiles Revealed</div>
                <div className="text-lg font-bold text-primary">{revealedCount}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-accent text-primary font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              onClick={onPlayAgain}
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

