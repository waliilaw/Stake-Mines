"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Coins, Award, AlertTriangle } from "lucide-react"
import Image from "next/image"

interface GameRulesProps {
  onClose: () => void
  setCursorVariant: (variant: string) => void
}

export default function GameRules({ onClose, setCursorVariant }: GameRulesProps) {
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: { duration: 0.2 },
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
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-800/90 backdrop-blur-sm border border-teal-900/50 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto relative"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-crypto bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
            HOW TO PLAY
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-900/30 flex items-center justify-center">
                <Image src="/images/diamond.png" alt="Diamond" width={24} height={24} className="drop-shadow-glow" />
              </div>
              <h3 className="text-lg font-crypto text-teal-400">Game Objective</h3>
            </div>
            <p className="text-slate-300 pl-12">
              Reveal as many diamonds as possible without hitting any mines. Each diamond increases your winnings!
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center">
                <Coins className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-crypto text-amber-400">Betting</h3>
            </div>
            <p className="text-slate-300 pl-12">
              Place your bet before starting the game. Your potential winnings increase with each safe tile you reveal.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
                <Image src="/images/mine.png" alt="Mine" width={24} height={24} className="drop-shadow-red" />
              </div>
              <h3 className="text-lg font-crypto text-red-400">Mines</h3>
            </div>
            <p className="text-slate-300 pl-12">
              Mines are hidden throughout the grid. If you reveal a mine, the game ends and you lose your bet.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center">
                <Award className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-crypto text-emerald-400">Winning</h3>
            </div>
            <p className="text-slate-300 pl-12">
              You can cash out at any time to secure your current winnings. The longer you play, the higher your
              potential reward!
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-crypto text-orange-400">Risk Level</h3>
            </div>
            <p className="text-slate-300 pl-12">
              Choose your difficulty level wisely. Higher difficulties have more mines but offer greater rewards!
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-teal-500 to-amber-500 hover:from-teal-600 hover:to-amber-600 text-black font-bold"
            >
              Start Mining!
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

