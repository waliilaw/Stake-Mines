"use client"

import { useState, useCallback } from "react"
import { useWalletState } from "@/lib/store/game-store"

export default function useWallet() {
  const { isWalletConnected, walletBalance, setWalletConnected } = useWalletState()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = useCallback(async () => {
    if (isWalletConnected) return

    setIsConnecting(true)
    setError(null)

    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful connection
      setWalletConnected(true)
    } catch (err) {
      setError("Failed to connect wallet. Please try again.")
      console.error(err)
    } finally {
      setIsConnecting(false)
    }
  }, [isWalletConnected, setWalletConnected])

  const disconnectWallet = useCallback(() => {
    setWalletConnected(false)
  }, [setWalletConnected])

  const formatBalance = useCallback((balance: number) => {
    return balance.toFixed(2)
  }, [])

  return {
    isWalletConnected,
    walletBalance,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    formatBalance,
  }
}

