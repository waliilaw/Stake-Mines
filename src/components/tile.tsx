"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bomb, Diamond } from "lucide-react"

interface TileProps {
  isMine: boolean
  isRevealed: boolean
  adjacentMines: number
  onClick: () => void
  isGameOver: boolean
  isLastRevealed: boolean
  isInRevealQueue: boolean
  revealDelay: number
  row: number
  col: number
}

export default function Tile({
  isMine,
  isRevealed,
  adjacentMines,
  onClick,
  isGameOver,
  isLastRevealed,
  isInRevealQueue,
  revealDelay,
  row,
  col,
}: TileProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showExplosion, setShowExplosion] = useState(false)
  const [showSparkle, setShowSparkle] = useState(false)

  // Handle explosion animation
  useEffect(() => {
    if (isRevealed && isMine && isLastRevealed) {
      setShowExplosion(true)
      const timer = setTimeout(() => {
        setShowExplosion(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isRevealed, isMine, isLastRevealed])

  // Handle sparkle animation
  useEffect(() => {
    if (isRevealed && !isMine && isLastRevealed) {
      setShowSparkle(true)
      const timer = setTimeout(() => {
        setShowSparkle(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isRevealed, isMine, isLastRevealed])

  // Determine tile background color
  const getTileBackgroundColor = () => {
    if (!isRevealed) {
      return isHovered ? "bg-secondary/80" : "bg-secondary"
    }

    if (isMine) {
      return "bg-red-500"
    }

    return "bg-accent"
  }

  // Determine tile content
  const renderTileContent = () => {
    if (!isRevealed) {
      return null
    }

    if (isMine) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: isInRevealQueue ? revealDelay : 0 }}
          className="relative"
        >
          <Bomb className="w-8 h-8 text-black" />
          {showExplosion && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full h-full rounded-full bg-orange-500/70" />
            </motion.div>
          )}
        </motion.div>
      )
    }

    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="relative"
      >
        <Diamond className="w-8 h-8 text-primary" />
        {showSparkle && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-full h-full rounded-full bg-yellow-300/70" />
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: isRevealed ? 1 : 1.05 }}
      whileTap={{ scale: isRevealed ? 1 : 0.95 }}
      initial={isInRevealQueue ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
      animate={isInRevealQueue ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
      transition={{ delay: isInRevealQueue ? revealDelay : 0 }}
      className={`
        aspect-square rounded-lg shadow-md flex items-center justify-center cursor-pointer
        ${getTileBackgroundColor()}
        ${isRevealed ? "" : "hover:shadow-lg transition-all duration-200"}
        ${isLastRevealed ? "ring-4 ring-white" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isRevealed ? undefined : onClick}
    >
      {renderTileContent()}
    </motion.div>
  )
}

