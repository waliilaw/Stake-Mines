"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GameBoard from "@/components/game-board"
import Scoreboard from "@/components/scoreboard"
import GameControls from "@/components/game-controls"
import { GameProvider } from "@/context/game-context"
import WalletConnection from "@/components/wallet-connection"
import GameHeader from "@/components/game-header"
import GameFooter from "@/components/game-footer"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import GameRules from "@/components/game-rules"
import { useMediaQuery } from "@/hooks/use-media-query"
import HeroSection from "@/components/hero-section"
import FloatingElements from "@/components/floating-elements"
import ParticleBackground from "@/components/particle-background"
import StatsSection from "@/components/stats-section"
import Cursor from "@/components/cursor"

export default function MinesGame() {
  const [showRules, setShowRules] = useState(false)
  const [showGame, setShowGame] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  // Handle cursor movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Welcome toast when the game loads
  useEffect(() => {
    if (showGame) {
      toast({
        title: "Welcome to CryptoMines!",
        description: "Find the diamonds, avoid the mines, win big rewards!",
        duration: 5000,
      })
    }
  }, [showGame, toast])

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-b from-teal-900 to-slate-900 text-white font-sans overflow-hidden relative">
        {!isMobile && <Cursor position={cursorPosition} variant={cursorVariant} />}
        <ParticleBackground />

        <AnimatePresence mode="wait">
          {!showGame ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection onStartGame={() => setShowGame(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <FloatingElements />

              <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen relative z-10">
                <GameHeader
                  onShowRules={() => setShowRules(true)}
                  onBackToHome={() => setShowGame(false)}
                  setCursorVariant={setCursorVariant}
                />

                <main className="flex-grow flex flex-col md:flex-row gap-8 items-center justify-center py-8">
                  <motion.div
                    className="w-full md:w-2/3 lg:w-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GameBoard setCursorVariant={setCursorVariant} />
                  </motion.div>

                  <motion.div
                    className="w-full md:w-1/3 lg:w-1/4 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Scoreboard />
                    <GameControls setCursorVariant={setCursorVariant} />
                    <WalletConnection setCursorVariant={setCursorVariant} />
                  </motion.div>
                </main>

                <StatsSection />
                <GameFooter setCursorVariant={setCursorVariant} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRules && <GameRules onClose={() => setShowRules(false)} setCursorVariant={setCursorVariant} />}
        </AnimatePresence>

        <Toaster />
      </div>
    </GameProvider>
  )
}

