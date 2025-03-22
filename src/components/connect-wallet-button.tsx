"use client"

import { motion } from "framer-motion"
import { Wallet } from "lucide-react"

interface ConnectWalletButtonProps {
  isConnected: boolean
  onConnect: () => void
}

export default function ConnectWalletButton({ isConnected, onConnect }: ConnectWalletButtonProps) {
  if (isConnected) return null

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-accent text-primary px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-lg"
      onClick={onConnect}
    >
      <Wallet className="w-5 h-5" />
      <span>Connect Wallet</span>
    </motion.button>
  )
}

