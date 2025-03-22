"use client"

import { useState, useEffect } from "react"
import Tile from "./tile"

interface GameBoardProps {
  grid: Array<Array<{ isMine: boolean; isRevealed: boolean; adjacentMines: number }>>
  onTileClick: (row: number, col: number) => void
  gameOver: boolean
  lastRevealedTile: { row: number; col: number } | null
  revealedTiles: Array<{ row: number; col: number }>
  minePositions: Array<{ row: number; col: number }>
}

export default function GameBoard({
  grid,
  onTileClick,
  gameOver,
  lastRevealedTile,
  revealedTiles,
  minePositions,
}: GameBoardProps) {
  const [revealAnimationQueue, setRevealAnimationQueue] = useState<Array<{ row: number; col: number; delay: number }>>(
    [],
  )
  const [showMines, setShowMines] = useState(false)

  // Handle game over - reveal all mines with a cascading animation
  useEffect(() => {
    if (gameOver && minePositions.length > 0) {
      const queue: Array<{ row: number; col: number; delay: number }> = []

      minePositions.forEach((pos, index) => {
        queue.push({
          row: pos.row,
          col: pos.col,
          delay: index * 0.1, // Stagger the reveal animation
        })
      })

      setRevealAnimationQueue(queue)

      // Show mines after a delay
      const timer = setTimeout(() => {
        setShowMines(true)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setShowMines(false)
      setRevealAnimationQueue([])
    }
  }, [gameOver, minePositions])

  // Check if a tile is in the reveal animation queue
  const isInRevealQueue = (row: number, col: number) => {
    return revealAnimationQueue.some((item) => item.row === row && item.col === col)
  }

  // Get the delay for a tile in the reveal animation queue
  const getRevealDelay = (row: number, col: number) => {
    const queueItem = revealAnimationQueue.find((item) => item.row === row && item.col === col)
    return queueItem ? queueItem.delay : 0
  }

  // Check if a tile is the last revealed tile
  const isLastRevealed = (row: number, col: number) => {
    return lastRevealedTile?.row === row && lastRevealedTile?.col === col
  }

  return (
    <div className="w-full aspect-square">
      <div className="grid grid-cols-5 gap-2 w-full h-full">
        {grid.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              isMine={tile.isMine}
              isRevealed={tile.isRevealed || (showMines && tile.isMine)}
              adjacentMines={tile.adjacentMines}
              onClick={() => onTileClick(rowIndex, colIndex)}
              isGameOver={gameOver}
              isLastRevealed={isLastRevealed(rowIndex, colIndex)}
              isInRevealQueue={isInRevealQueue(rowIndex, colIndex)}
              revealDelay={getRevealDelay(rowIndex, colIndex)}
              row={rowIndex}
              col={colIndex}
            />
          )),
        )}
      </div>
    </div>
  )
}

