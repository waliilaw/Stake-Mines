"use client"

import { motion } from "framer-motion"
import { Wallet } from "lucide-react"
import useWallet from "@/lib/hooks/use-wallet"
import useSound from "@/lib/hooks/use-sound"

export default function ConnectWalletButton() {
  const { isWalletConnected, isConnecting, connectWallet } = useWallet()
  const { playButtonSound } = useSound()

  if (isWalletConnected) return null

  const handleConnect = () => {
    playButtonSound()
    connectWallet()
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cartoon-button-pink bg-accent text-primary-foreground px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-lg neon-border-pink"
      onClick={handleConnect}
      disabled={isConnecting}
    >
      <Wallet className="w-5 h-5" />
      <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>

      {isConnecting && (
        <div className="ml-2 w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      )}
    </motion.button>
  )
}

