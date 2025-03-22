"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, LogIn, LogOut, ExternalLink, Copy, CheckCircle } from "lucide-react"
import Image from "next/image"

interface WalletConnectionProps {
  setCursorVariant: (variant: string) => void
}

export default function WalletConnection({ setCursorVariant }: WalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock wallet connection
  const connectWallet = () => {
    setIsLoading(true)

    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 14)
      setWalletAddress(mockAddress)
      setIsConnected(true)
      setIsLoading(false)
    }, 1500)
  }

  // Mock wallet disconnection
  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
  }

  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  // Handle hover events for cursor
  const handleMouseEnter = () => {
    setCursorVariant("hover")
  }

  const handleMouseLeave = () => {
    setCursorVariant("default")
  }

  return (
    <Card
      className="bg-slate-800/30 backdrop-blur-sm border-teal-900/50 overflow-hidden relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <CardHeader className="pb-2 relative">
        <CardTitle className="font-crypto text-2xl text-center bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
          WALLET
        </CardTitle>
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/10 via-transparent to-amber-500/10 blur-sm -z-10"></div>
      </CardHeader>

      <CardContent>
        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
          {isConnected ? (
            <>
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-900/30 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-slate-300">Connected:</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm text-teal-400">
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </span>
                  <button onClick={copyToClipboard} className="text-slate-400 hover:text-teal-400 transition-colors">
                    {isCopied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center">
                    <Image src="/images/3d-money.png" alt="Balance" width={20} height={20} />
                  </div>
                  <span className="text-slate-300">Balance:</span>
                </div>
                <span className="font-bold text-amber-400">{(Math.random() * 10).toFixed(4)} ETH</span>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect Wallet
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div variants={itemVariants}>
              <Button
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Connecting...
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>

              <p className="text-xs text-slate-400 mt-2 text-center">Connect your wallet to save your winnings</p>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <Button variant="link" className="w-full text-teal-400 hover:text-teal-300" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                View Transactions
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

