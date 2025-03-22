"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import useWallet from "@/lib/hooks/use-wallet"
import useSound from "@/lib/hooks/use-sound"

export default function WalletPanel() {
  const { isWalletConnected, walletBalance, connectWallet, formatBalance, isConnecting } = useWallet()

  const { playButtonSound } = useSound()

  const handleConnectWallet = () => {
    playButtonSound()
    connectWallet()
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-md neon-border">
      <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-4 neon-text">
        <Image src="/images/dollar.png" alt="$" width={20} height={20} className="w-5 h-5 object-contain" />
        <span>Wallet</span>
      </h3>

      {isWalletConnected ? (
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">Balance</div>
            <div className="text-xl font-bold text-primary flex items-center gap-1">
              <Image src="/images/dollar.png" alt="$" width={20} height={20} className="w-5 h-5 object-contain" />
              {formatBalance(walletBalance)} ETH
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-primary font-medium">Connected</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4">
          <p className="text-primary/70 mb-4 text-center">Connect your wallet to start playing and winning crypto!</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cartoon-button-pink bg-accent text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 font-bold"
            onClick={handleConnectWallet}
            disabled={isConnecting}
          >
            <Image src="/images/dollar.png" alt="$" width={20} height={20} className="w-5 h-5 object-contain" />
            <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>

            {isConnecting && (
              <div className="ml-2 w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            )}
          </motion.button>
        </div>
      )}
    </div>
  )
}

