"use client"

import { motion } from "framer-motion"

interface GameFooterProps {
  setCursorVariant: (variant: string) => void
}

export default function GameFooter({ setCursorVariant }: GameFooterProps) {
  // Handle hover events for cursor
  const handleMouseEnter = () => {
    setCursorVariant("hover")
  }

  const handleMouseLeave = () => {
    setCursorVariant("default")
  }

  return (
    <footer
      className="py-6 mt-8 border-t border-teal-900/30"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-400">
            <p>© {new Date().getFullYear()} CryptoMines. All rights reserved.</p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
              Contact
            </a>
          </div>

          <div className="text-sm text-slate-400">
            <p>Play responsibly</p>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

