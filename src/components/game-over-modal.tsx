"use client"

import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import Image from "next/image"
import { useGameState, useGameActions, useUIState } from "@/lib/store/game-store"
import useSound from "@/lib/hooks/use-sound"

export default function GameOverModal() {
  const { betAmount, minesCount } = useGameState()
  const { resetGame } = useGameActions()
  const { closeGameOverModal } = useUIState()
  const { playButtonSound } = useSound()

  const handlePlayAgain = () => {
    playButtonSound()
    resetGame()
    closeGameOverModal()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={closeGameOverModal}
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
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 15, -15, 15, -15, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center mb-4"
          >
            <Image src="/images/bomb.png" alt="Bomb" width={40} height={40} className="w-10 h-10 object-contain" />
          </motion.div>

          <h2 className="text-2xl font-bold text-primary mb-2 neon-text">BOOM! Game Over</h2>

          <p className="text-primary/70 mb-6">You hit a mine and lost your bet of {betAmount.toFixed(2)} ETH.</p>

          <div className="bg-muted rounded-lg p-4 mb-6 w-full">
            <div className="text-sm text-primary/70 mb-1">Game Stats</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-primary/70">Bet Amount</div>
                <div className="text-lg font-bold text-primary">{betAmount.toFixed(2)} ETH</div>
              </div>
              <div>
                <div className="text-sm text-primary/70">Mines</div>
                <div className="text-lg font-bold text-primary">{minesCount}</div>
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

