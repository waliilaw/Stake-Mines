"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useGame } from "@/context/game-context"
import { Trophy, Users, TrendingUp, Clock } from "lucide-react"

export default function StatsSection() {
  const { isGameStarted } = useGame()

  // Skip rendering if game is started
  if (isGameStarted) return null

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
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

  return (
    <motion.div className="py-12" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2
        className="text-3xl font-crypto text-center mb-10 bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        GAME STATISTICS
      </motion.h2>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={itemVariants}>
        <StatCard
          icon={<Users className="w-6 h-6 text-teal-400" />}
          title="Active Players"
          value="2,547"
          trend="+12% this week"
        />

        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
          title="Total Winnings"
          value="$1,245,890"
          trend="+5% this week"
        />

        <StatCard
          icon={<Trophy className="w-6 h-6 text-emerald-400" />}
          title="Biggest Win"
          value="$24,680"
          trend="by CryptoKing"
        />

        <StatCard
          icon={<Clock className="w-6 h-6 text-cyan-400" />}
          title="Average Game Time"
          value="3:24"
          trend="minutes per game"
        />
      </motion.div>
    </motion.div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  trend: string
}

function StatCard({ icon, title, value, trend }: StatCardProps) {
  return (
    <motion.div
      className="bg-slate-800/30 backdrop-blur-sm border border-teal-900/50 rounded-xl p-6 relative overflow-hidden"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg text-slate-400 mb-1">{title}</h3>
          <p className="text-3xl font-crypto text-white">{value}</p>
          <p className="text-sm text-teal-400 mt-2">{trend}</p>
        </div>
        <div className="bg-slate-900/50 rounded-full p-3">{icon}</div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/10 via-transparent to-amber-500/10 rounded-xl blur-sm -z-10"></div>
    </motion.div>
  )
}

