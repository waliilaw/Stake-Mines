"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

type TileState = "unrevealed" | "safe" | "mine"

interface TileProps {
  state: TileState
  value: number
  onClick: () => void
  disabled: boolean
  position: [number, number]
  className?: string
}

export default function Tile({ state, value, onClick, disabled, position, className }: TileProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [showRipple, setShowRipple] = useState(false)
  const tileRef = useRef<HTMLButtonElement>(null)
  const controls = useAnimation()

  // Determine background color based on tile state
  const getBgColor = () => {
    switch (state) {
      case "unrevealed":
        return "bg-slate-800/80 hover:bg-slate-700/80"
      case "safe":
        return "bg-teal-700/80"
      case "mine":
        return "bg-red-700/80"
      default:
        return "bg-slate-800/80"
    }
  }

  // Animation variants for tile content
  const contentVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
        delay: 0.1,
      },
    },
  }

  // Animation variants for hover effect
  const hoverVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" },
  }

  // Animation for ripple effect
  const rippleVariants = {
    hidden: { scale: 0, opacity: 0.7 },
    visible: {
      scale: 2,
      opacity: 0,
      transition: { duration: 0.8 },
    },
  }

  // Handle click with ripple effect
  const handleClick = () => {
    if (!disabled) {
      setShowRipple(true)
      onClick()

      // Shake animation for mine
      if (value === 1) {
        controls.start({
          x: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.5 },
        })
      }
    }
  }

  // Reset ripple effect
  useEffect(() => {
    if (showRipple) {
      const timer = setTimeout(() => {
        setShowRipple(false)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [showRipple])

  // Render tile content based on state
  const renderTileContent = () => {
    if (state === "unrevealed") {
      return null
    } else if (state === "safe") {
      return (
        <motion.div variants={contentVariants} initial="hidden" animate="visible" className="relative">
          <Image
            src="/images/diamond.png"
            alt="Diamond"
            width={40}
            height={40}
            className="drop-shadow-glow animate-float"
          />
        </motion.div>
      )
    } else if (state === "mine") {
      return (
        <motion.div variants={contentVariants} initial="hidden" animate="visible" className="relative">
          <Image src="/images/mine.png" alt="Mine" width={40} height={40} className="drop-shadow-red animate-pulse" />
        </motion.div>
      )
    }
  }

  return (
    <motion.button
      ref={tileRef}
      className={cn(
        "relative rounded-lg flex items-center justify-center cursor-pointer transition-colors shadow-md overflow-hidden",
        getBgColor(),
        disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer",
        className,
      )}
      onClick={handleClick}
      disabled={disabled}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      variants={hoverVariants}
      initial="idle"
      whileHover={!disabled ? "hover" : "idle"}
      whileTap={{ scale: 0.95 }}
      animate={controls}
      layout
    >
      {/* Border glow effect */}
      <div
        className={cn(
          "absolute inset-0 border rounded-lg transition-opacity",
          state === "safe" ? "border-teal-500/50" : state === "mine" ? "border-red-500/50" : "border-slate-600/50",
        )}
      ></div>

      {renderTileContent()}

      {isHovering && state === "unrevealed" && !disabled && (
        <motion.div
          className="absolute inset-0 bg-teal-400/20 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <AnimatePresence>
        {showRipple && (
          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            variants={rippleVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

