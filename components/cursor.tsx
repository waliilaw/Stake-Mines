"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface CursorProps {
  position: { x: number; y: number }
  variant: string
}

export default function Cursor({ position, variant }: CursorProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show cursor after a short delay to prevent initial flash
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Don't render if not visible
  if (!isVisible) return null

  // Cursor variants
  const cursorVariants = {
    default: {
      x: position.x - 16,
      y: position.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(45, 212, 191, 0.2)",
      mixBlendMode: "normal" as const,
    },
    hover: {
      x: position.x - 24,
      y: position.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(45, 212, 191, 0.4)",
      mixBlendMode: "normal" as const,
    },
  }

  // Inner cursor variants
  const innerCursorVariants = {
    default: {
      x: position.x - 4,
      y: position.y - 4,
      height: 8,
      width: 8,
    },
    hover: {
      x: position.x - 6,
      y: position.y - 6,
      height: 12,
      width: 12,
    },
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-teal-400 pointer-events-none z-50"
        variants={cursorVariants}
        animate={variant}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-teal-400 pointer-events-none z-50"
        variants={innerCursorVariants}
        animate={variant}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      />
    </>
  )
}

