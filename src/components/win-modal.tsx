"use client"

import { motion } from "framer-motion"
import { Trophy, RotateCcw } from "lucide-react"
import { useGameState, useGameActions, useUIState } from "@/lib/store/game-store"
import useSound from "@/lib/hooks/use-sound"
import useConfetti from "@/lib/hooks/use-confetti"
import { useEffect } from "react"
import { formatCurrency, calculateMultiplier } from "@/lib/game-utils"

export default function WinModal() {
  const { winnings, betAmount, revealedCount } = useGameState()
  const { resetGame } = useGameActions()
  const { closeWinModal } = useUIState()
  const { playButtonSound } = useSound()
  const { realisticLook, cleanup } = useConfetti()

  const profit = winnings - betAmount
  const multiplier = winnings / betAmount

  useEffect(() => {
    // Trigger confetti when modal opens
    realisticLook()

    // Clean up confetti when modal closes
    return () => cleanup()
  }, [realisticLook, cleanup])

  const handlePlayAgain = () => {
    playButtonSound()
    resetGame()
    closeWinModal()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={closeWinModal}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card rounded-xl p-6 max-w-md w-full shadow-xl neon-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-4 glow-effect"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold text-primary mb-2 neon-text">Congratulations!</h2>

          <p className="text-primary/70 mb-6">You successfully cashed out and won {formatCurrency(winnings)} ETH!</p>

          <div className="bg-muted rounded-lg p-4 mb-6 w-full">
            <div className="text-sm text-primary/70 mb-1">Game Stats</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-primary/70">Bet Amount</div>
                <div className="text-lg font-bold text-primary">{formatCurrency(betAmount)} ETH</div>
              </div>
              <div>
                <div className="text-sm text-primary/70">Profit</div>
                <div className="text-lg font-bold text-primary">{formatCurrency(profit)} ETH</div>
              </div>
              <div>
                <div className="text-sm text-primary/70">Multiplier</div>
                <div className="text-lg font-bold text-primary">{calculateMultiplier(betAmount, winnings)}</div>
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
              className="cartoon-button flex-1 bg-accent text-primary font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
              onClick={handlePlayAgain}
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

