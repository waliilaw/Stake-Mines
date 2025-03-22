"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HelpCircle, Github, ChevronLeft, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

interface GameHeaderProps {
  onShowRules: () => void
  onBackToHome: () => void
  setCursorVariant: (variant: string) => void
}

export default function GameHeader({ onShowRules, onBackToHome, setCursorVariant }: GameHeaderProps) {
  const [isMuted, setIsMuted] = useState(false)

  // Handle hover events for cursor
  const handleMouseEnter = () => {
    setCursorVariant("hover")
  }

  const handleMouseLeave = () => {
    setCursorVariant("default")
  }

  return (
    <header className="py-6">
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToHome}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                animate={{
                  y: ["-5%", "5%"],
                }}
                transition={{
                  y: {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }}
              >
                <Image
                  src="/images/3d-money.png"
                  alt="CryptoMines Logo"
                  width={40}
                  height={40}
                  className="drop-shadow-glow"
                />
              </motion.div>
              <motion.div
                className="absolute -inset-2 rounded-full bg-gradient-to-r from-teal-500/20 to-amber-500/20 -z-10"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(45, 212, 191, 0.5)",
                    "0 0 20px rgba(45, 212, 191, 0.7)",
                    "0 0 10px rgba(45, 212, 191, 0.5)",
                  ],
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  },
                }}
              ></motion.div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-crypto bg-gradient-to-r from-teal-400 via-amber-300 to-teal-400 bg-clip-text text-transparent">
              CRYPTO<span className="text-white">MINES</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-teal-400"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
            {isMuted ? "Unmute" : "Mute"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-teal-400"
            onClick={onShowRules}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            How to Play
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:text-teal-400"
            asChild
          >
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </motion.div>
    </header>
  )
}

