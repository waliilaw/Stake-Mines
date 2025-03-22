"use client"

import { motion } from "framer-motion"
import { Trophy, RotateCcw, Play } from "lucide-react"
import { useGameState, useGameActions } from "@/lib/store/game-store"
import useSound from "@/lib/hooks/use-sound"
import useWallet from "@/lib/hooks/use-wallet"

export default function GameControls() {
  const { isGameStarted, gameOver, revealedCount } = useGameState()
  const { startGame, resetGame, handleCashout } = useGameActions()
  const { isWalletConnected } = useWallet()
  const { playButtonSound, playStartGameSound, playCashoutSound } = useSound()

  const handleStartGame = () => {
    if (!isWalletConnected) return
    playButtonSound()
    playStartGameSound()
    startGame()
  }

  const handleResetGame = () => {
    playButtonSound()
    resetGame()
  }

  const handleCashoutClick = () => {
    playButtonSound()
    playCashoutSound()
    handleCashout()
  }

  return (
    <div className="flex gap-2 mt-4">
      {!isGameStarted ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            cartoon-button flex-1 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg 
            flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all
            ${!isWalletConnected ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={handleStartGame}
          disabled={!isWalletConnected}
        >
          <Play className="w-5 h-5" />
          Start Game
        </motion.button>
      ) : (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              cartoon-button-pink flex-1 bg-accent text-primary-foreground font-bold py-3 px-6 rounded-lg 
              flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all
              ${gameOver || revealedCount === 0 ? "opacity-50 cursor-not-allowed" : ""}
            `}
            onClick={handleCashoutClick}
            disabled={gameOver || revealedCount === 0}
          >
            <Trophy className="w-5 h-5" />
            Cash Out
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cartoon-button bg-muted text-primary font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            onClick={handleResetGame}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </>
      )}
    </div>
  )
}

