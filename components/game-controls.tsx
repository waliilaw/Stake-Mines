"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useGame } from "@/context/game-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { PlayCircle, RefreshCw, DollarSign, CreditCard, Gamepad2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GameControlsProps {
  setCursorVariant: (variant: string) => void
}

export default function GameControls({ setCursorVariant }: GameControlsProps) {
  const { startGame, resetGame, isGameStarted, gameOver, betAmount, setBetAmount, difficulty, setDifficulty, cashOut } =
    useGame()

  const [tempBetAmount, setTempBetAmount] = useState(betAmount.toString())

  // Handle bet amount change
  const handleBetChange = (value: string) => {
    setTempBetAmount(value)
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setBetAmount(numValue)
    }
  }

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newValue = value[0]
    setTempBetAmount(newValue.toString())
    setBetAmount(newValue)
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
          GAME CONTROLS
        </CardTitle>
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/10 via-transparent to-amber-500/10 blur-sm -z-10"></div>
      </CardHeader>

      <CardContent>
        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm text-slate-300 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-teal-400" />
              Difficulty
            </label>
            <Select value={difficulty} onValueChange={setDifficulty} disabled={isGameStarted && !gameOver}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600/50">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="easy">Easy (5x5, 5 mines)</SelectItem>
                <SelectItem value="medium">Medium (7x7, 10 mines)</SelectItem>
                <SelectItem value="hard">Hard (10x10, 20 mines)</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm text-slate-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Bet Amount
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={tempBetAmount}
                onChange={(e) => handleBetChange(e.target.value)}
                className="bg-slate-700/50 border-slate-600/50"
                disabled={isGameStarted && !gameOver}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2 pb-4">
            <Slider
              defaultValue={[1]}
              min={0.1}
              max={10}
              step={0.1}
              value={[betAmount]}
              onValueChange={handleSliderChange}
              disabled={isGameStarted && !gameOver}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0.1</span>
              <span>5.0</span>
              <span>10.0</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            {!isGameStarted || gameOver ? (
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-teal-500 to-amber-500 hover:from-teal-600 hover:to-amber-600 text-black font-bold"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Mining
              </Button>
            ) : (
              <Button
                onClick={cashOut}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Cash Out
              </Button>
            )}

            <Button
              onClick={resetGame}
              variant="outline"
              className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
              disabled={!isGameStarted}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Game
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

