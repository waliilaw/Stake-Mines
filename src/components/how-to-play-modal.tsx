"use client"

import { motion } from "framer-motion"
import { X, Trophy, Info } from "lucide-react"
import Image from "next/image"
import { useUIState } from "@/lib/store/game-store"
import useSound from "@/lib/hooks/use-sound"

export default function HowToPlayModal() {
  const { toggleHowToPlayModal } = useUIState()
  const { playButtonSound } = useSound()

  const handleClose = () => {
    playButtonSound()
    toggleHowToPlayModal()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card rounded-xl p-6 max-w-2xl w-full shadow-xl max-h-[80vh] overflow-y-auto neon-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2 neon-text">
            <Info className="w-6 h-6" />
            How to Play
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary"
            onClick={handleClose}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-primary mb-2">Game Objective</h3>
            <p className="text-primary/70">
              The goal of Mines is to reveal as many safe tiles as possible without hitting a mine. Each safe tile you
              reveal increases your potential winnings.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mb-2">How to Play</h3>
            <ol className="list-decimal list-inside space-y-2 text-primary/70">
              <li>Set your bet amount and the number of mines you want on the board.</li>
              <li>Click the "Start Game" button to begin.</li>
              <li>Click on tiles to reveal them. Safe tiles will show a diamond, mines will show a bomb.</li>
              <li>Each safe tile you reveal increases your potential winnings.</li>
              <li>You can cash out at any time to secure your winnings.</li>
              <li>If you hit a mine, you lose your bet.</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Image
                    src="/images/diamond.png"
                    alt="Diamond"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <h4 className="font-bold text-primary">Safe Tile</h4>
              </div>
              <p className="text-primary/70">
                Reveals a diamond and increases your potential winnings. The more safe tiles you reveal, the higher your
                multiplier.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-destructive rounded-lg flex items-center justify-center">
                  <Image src="/images/bomb.png" alt="Bomb" width={24} height={24} className="w-6 h-6 object-contain" />
                </div>
                <h4 className="font-bold text-primary">Mine</h4>
              </div>
              <p className="text-primary/70">
                Hitting a mine ends the game and you lose your bet. The more mines you select, the higher the potential
                rewards.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-primary">Cash Out</h4>
              </div>
              <p className="text-primary/70">
                Click the "Cash Out" button at any time to secure your current winnings and end the game.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mb-2">Risk vs. Reward</h3>
            <p className="text-primary/70">
              The more mines you select, the higher the potential rewards, but also the higher the risk. Choose your
              strategy wisely!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

