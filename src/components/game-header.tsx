"use client"

import { motion } from "framer-motion"
import { Wallet, Info, Volume2, VolumeX } from "lucide-react"
import { Bomb } from "lucide-react"

// Update the GameHeaderProps interface to include soundsEnabled
interface GameHeaderProps {
  isWalletConnected: boolean
  setIsWalletConnected: (connected: boolean) => void
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
  onHowToPlay: () => void
  soundsEnabled?: boolean
}

// Update the component parameters to include soundsEnabled
export default function GameHeader({
  isWalletConnected,
  setIsWalletConnected,
  isMuted,
  setIsMuted,
  onHowToPlay,
  soundsEnabled,
}: GameHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-10 h-10 bg-accent rounded-full flex items-center justify-center"
        >
          <Bomb className="w-6 h-6 text-primary" />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Mines Game</h1>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${soundsEnabled === false && !isMuted ? "bg-yellow-200" : "bg-secondary"}`}
          onClick={() => setIsMuted(!isMuted)}
          title={
            soundsEnabled === false && !isMuted ? "Click to enable sounds" : isMuted ? "Unmute sounds" : "Mute sounds"
          }
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-primary" /> : <Volume2 className="w-5 h-5 text-primary" />}
          {soundsEnabled === false && !isMuted && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary"
          onClick={onHowToPlay}
        >
          <Info className="w-5 h-5" />
        </motion.button>

        {isWalletConnected ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-accent text-primary px-4 py-2 rounded-full flex items-center gap-2 font-medium"
          >
            <Wallet className="w-4 h-4" />
            <span>Connected</span>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-secondary text-primary px-4 py-2 rounded-full flex items-center gap-2 font-medium"
            onClick={() => setIsWalletConnected(true)}
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </motion.button>
        )}
      </div>
    </div>
  )
}

