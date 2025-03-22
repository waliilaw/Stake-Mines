"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Play, Pause, Settings } from "lucide-react"
import Image from "next/image"
import { useAutoPlayState, useGameState } from "@/lib/store/game-store"
import useSound from "@/lib/hooks/use-sound"

export default function AutoPlayPanel() {
  const {
    isAutoPlayEnabled,
    isAutoPlaying,
    autoPlayDelay,
    cashoutMultiplier,
    toggleAutoPlay,
    setCashoutMultiplier,
    setAutoPlayDelay,
  } = useAutoPlayState()

  const { isGameStarted, gameOver } = useGameState()
  const { playButtonSound } = useSound()

  const handleToggleAutoPlay = () => {
    playButtonSound()
    toggleAutoPlay()
  }

  const handleCashoutMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value) && value >= 1) {
      setCashoutMultiplier(value)
    }
  }

  const handleAutoPlayDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 100) {
      setAutoPlayDelay(value)
    }
  }

  return (
    <div className="bg-card rounded-lg p-4 shadow-md neon-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2 neon-text">
          <Settings className="w-5 h-5" />
          <span>Auto Play</span>
        </h3>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            cartoon-button px-4 py-2 rounded-lg flex items-center gap-2
            ${isAutoPlayEnabled ? "bg-accent text-primary-foreground" : "bg-muted text-primary"}
            ${!isGameStarted || gameOver ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={handleToggleAutoPlay}
          disabled={!isGameStarted || gameOver}
        >
          {isAutoPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-primary/70 mb-1 block">Cashout Multiplier</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={cashoutMultiplier}
              onChange={handleCashoutMultiplierChange}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-primary font-medium w-12 text-center">{cashoutMultiplier.toFixed(1)}x</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-primary/70 mb-1 block">Delay (ms)</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={autoPlayDelay}
              onChange={handleAutoPlayDelayChange}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-primary font-medium w-16 text-center">{autoPlayDelay}ms</span>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-muted p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Image src="/images/arrow-up.png" alt="Arrow" width={20} height={20} className="w-5 h-5 object-contain" />
          <p className="text-sm text-primary/70">
            Auto Play will automatically reveal tiles and cash out when the multiplier reaches{" "}
            {cashoutMultiplier.toFixed(1)}x
          </p>
        </div>
      </div>
    </div>
  )
}

