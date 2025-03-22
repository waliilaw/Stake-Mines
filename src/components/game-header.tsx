"use client"

import { motion } from "framer-motion"
import { Info, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
import { useUIState, useWalletState } from "@/lib/store/game-store"
import useSound from "@/lib/hooks/use-sound"
import useWallet from "@/lib/hooks/use-wallet"

export default function GameHeader() {
  const { isMuted, setMuted, toggleHowToPlayModal } = useUIState()
  const { isWalletConnected } = useWalletState()
  const { connectWallet, walletBalance, formatBalance } = useWallet()
  const { playButtonSound, soundsEnabled } = useSound()

  const handleMuteToggle = () => {
    playButtonSound()
    setMuted(!isMuted)
  }

  const handleHowToPlay = () => {
    playButtonSound()
    toggleHowToPlayModal()
  }

  const handleConnectWallet = () => {
    playButtonSound()
    connectWallet()
  }

  return (
    <div className="w-full flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-10 h-10 bg-accent rounded-full flex items-center justify-center glow-effect-pink"
        >
          <Image src="/images/bomb.png" alt="Bomb" width={24} height={24} className="w-6 h-6 object-contain" />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary neon-text">Mines Game</h1>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`cartoon-button w-10 h-10 rounded-full flex items-center justify-center ${soundsEnabled === false && !isMuted ? "bg-yellow-200" : "bg-muted"}`}
          onClick={handleMuteToggle}
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
          className="cartoon-button w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary"
          onClick={handleHowToPlay}
        >
          <Info className="w-5 h-5" />
        </motion.button>

        {isWalletConnected ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cartoon-button-pink bg-accent text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2 font-medium"
          >
            <Image src="/images/dollar.png" alt="$" width={16} height={16} className="w-4 h-4 object-contain" />
            <span>{formatBalance(walletBalance)} ETH</span>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cartoon-button bg-muted text-primary px-4 py-2 rounded-full flex items-center gap-2 font-medium"
            onClick={handleConnectWallet}
          >
            <Image src="/images/dollar.png" alt="$" width={16} height={16} className="w-4 h-4 object-contain" />
            <span>Connect Wallet</span>
          </motion.button>
        )}
      </div>
    </div>
  )
}

