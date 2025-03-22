"use client"

import { useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import GameBoard from "./game-board"
import Scoreboard from "./scoreboard"
import BetPanel from "./bet-panel"
import GameHeader from "./game-header"
import GameFooter from "./game-footer"
import ConnectWalletButton from "./connect-wallet-button"
import GameOverModal from "./game-over-modal"
import WinModal from "./win-modal"
import HowToPlayModal from "./how-to-play-modal"
import GameControls from "./game-controls"
import WalletPanel from "./wallet-panel"
import AutoPlayPanel from "./auto-play-panel"
import GameStats from "./game-stats"

import useSound from "@/lib/hooks/use-sound"
import useWallet from "@/lib/hooks/use-wallet"
import useAutoPlay from "@/lib/hooks/use-auto-play"
import { useGameState, useGameActions, useUIState } from "@/lib/store/game-store"

export default function MinesGame() {
  // Game state from Zustand store
  const { grid, isGameStarted, gameOver, lastRevealedTile, revealedTiles, minePositions } = useGameState()

  // Game actions from Zustand store
  const { initializeGame, handleTileClick } = useGameActions()

  // UI state from Zustand store
  const { showGameOverModal, showWinModal, showHowToPlayModal } = useUIState()

  // Sound effects
  const { playStartGameSound } = useSound()

  // Wallet functionality
  const { isWalletConnected } = useWallet()

  // Auto play functionality
  useAutoPlay()

  // Initialize game on component mount
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col items-center">
      <GameHeader />

      <div className="w-full bg-card rounded-xl p-6 shadow-lg mb-6 neon-border">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <Scoreboard />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BetPanel />
              <WalletPanel />
            </div>

            <GameControls />

            <AutoPlayPanel />
          </div>

          <div className="flex-1">
            <GameBoard
              grid={grid}
              onTileClick={handleTileClick}
              gameOver={gameOver}
              lastRevealedTile={lastRevealedTile}
              revealedTiles={revealedTiles}
              minePositions={minePositions}
            />
          </div>
        </div>
      </div>

      <GameStats />

      <GameFooter />

      <AnimatePresence>{showGameOverModal && <GameOverModal />}</AnimatePresence>

      <AnimatePresence>{showWinModal && <WinModal />}</AnimatePresence>

      <AnimatePresence>{showHowToPlayModal && <HowToPlayModal />}</AnimatePresence>

      {!isWalletConnected && (
        <div className="fixed bottom-4 right-4">
          <ConnectWalletButton />
        </div>
      )}
    </div>
  )
}

