"use client"

import { motion } from "framer-motion"
import { useGame } from "@/context/game-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Diamond, Bomb, Coins, TrendingUp, Award } from "lucide-react"
import CountUp from "react-countup"

export default function Scoreboard() {
  const {
    winnings,
    betAmount,
    isGameStarted,
    gameOver,
    revealedCount,
    totalSafeTiles,
    mineCount,
    difficulty,
    gameWon,
  } = useGame()

  // Calculate potential next win amount (multiplier increases with each safe tile)
  const calculateNextWin = () => {
    if (!isGameStarted || gameOver) return 0
    const multiplier = 1 + revealedCount * 0.2
    return betAmount * multiplier
  }

  const completionPercentage = isGameStarted ? Math.round((revealedCount / totalSafeTiles) * 100) : 0

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

  const getMultiplierText = () => {
    if (revealedCount === 0) return "1.0x"
    return `${(1 + revealedCount * 0.2).toFixed(1)}x`
  }

  return (
    <Card className="bg-slate-800/30 backdrop-blur-sm border-teal-900/50 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <CardHeader className="pb-2 relative">
        <CardTitle className="font-crypto text-2xl text-center bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
          MINING STATS
        </CardTitle>
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/10 via-transparent to-amber-500/10 blur-sm -z-10"></div>
      </CardHeader>
      
      <CardContent>
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center">
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-slate-300">Bet Amount:</span>
            </div>
            <span className="font-bold text-amber-400">
              <CountUp 
                end={betAmount} 
                decimals={2} 
                duration={1} 
                preserveValue={true}
              />
            </span>
          </motion.div>

          {/* Rest of the motion.div items */}
          {/* ... */}

          {isGameStarted && (
            <motion.div 
              variants={itemVariants}
              className="pt-2"
            >
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progress:</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-teal-500 to-amber-500 h-2.5"
                  initial={{ width: "0%" }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}
          
          {gameWon && (
            <motion.div 
              variants={itemVariants}
              className="mt-4 p-3 bg-gradient-to-r from-teal-500/20 to-amber-500/20 rounded-lg border border-teal-500/30 text-center"
            >
              <p className="text-white font-crypto">JACKPOT!</p>
              <p className="text-sm text-slate-300">You found all the diamonds!</p>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}