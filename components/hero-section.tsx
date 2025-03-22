"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Diamond, Bomb, ChevronRight, DollarSign } from "lucide-react"
import Image from "next/image"

interface HeroSectionProps {
  onStartGame: () => void
}

export default function HeroSection({ onStartGame }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading delay for animation
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  const floatingAnimation = {
    y: ["-5%", "5%"],
    transition: {
      y: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  const glowAnimation = {
    boxShadow: [
      "0 0 10px rgba(45, 212, 191, 0.5)",
      "0 0 20px rgba(45, 212, 191, 0.7)",
      "0 0 10px rgba(45, 212, 191, 0.5)",
    ],
    transition: {
      boxShadow: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="h-full w-full bg-grid-pattern"></div>
      </div>

      <motion.div
        className="max-w-5xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Logo and title */}
        <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <motion.div animate={floatingAnimation} className="relative z-10">
              <Image
                src="/images/3d-money.png"
                alt="CryptoMines Logo"
                width={120}
                height={120}
                className="drop-shadow-glow"
              />
            </motion.div>
            <motion.div
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-teal-500/20 to-amber-500/20 z-0"
              animate={glowAnimation}
            ></motion.div>
          </div>

          <h1 className="text-5xl md:text-7xl font-crypto bg-gradient-to-r from-teal-400 via-amber-300 to-teal-400 bg-clip-text text-transparent pb-2">
            CRYPTO<span className="text-white">MINES</span>
          </h1>

          <motion.div
            className="h-1 w-40 bg-gradient-to-r from-teal-500 to-amber-500 rounded-full mt-2"
            initial={{ width: 0 }}
            animate={{ width: "10rem" }}
            transition={{ delay: 1, duration: 0.8 }}
          ></motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.h2 variants={itemVariants} className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Uncover hidden treasures in this high-stakes mining adventure.
          <span className="text-amber-400"> Will you risk it all for the big win?</span>
        </motion.h2>

        {/* Features */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<Diamond className="w-8 h-8 text-teal-400" />}
            title="Find Diamonds"
            description="Uncover valuable diamonds to increase your rewards with each discovery."
          />

          <FeatureCard
            icon={<Bomb className="w-8 h-8 text-red-400" />}
            title="Avoid Mines"
            description="Navigate carefully! One wrong move and your treasures are lost forever."
          />

          <FeatureCard
            icon={<DollarSign className="w-8 h-8 text-amber-400" />}
            title="Win Big"
            description="Cash out at any time to secure your winnings before it's too late."
          />
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <Button
            onClick={onStartGame}
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-amber-500 hover:from-teal-600 hover:to-amber-600 text-black font-bold text-lg px-8 py-6 rounded-full group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              START MINING
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
          </Button>

          <p className="mt-4 text-sm text-slate-400">No registration required. Start playing instantly!</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/60 transition-colors"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="bg-slate-900/50 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">{icon}</div>
      <h3 className="text-xl font-crypto text-center mb-2 text-white">{title}</h3>
      <p className="text-slate-400 text-center">{description}</p>
    </motion.div>
  )
}

