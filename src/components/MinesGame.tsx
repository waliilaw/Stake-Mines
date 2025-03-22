import { useState } from 'react';
import { motion } from 'framer-motion';

interface Tile {
  id: number;
  isRevealed: boolean;
  isMine: boolean;
}

export default function MinesGame() {
  const [tiles, setTiles] = useState<Tile[]>(Array(25).fill(null).map((_, i) => ({
    id: i,
    isRevealed: false,
    isMine: false
  })));
  const [betAmount, setBetAmount] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);

  const handleTileClick = (id: number) => {
    if (!isGameActive) return;
    
    setTiles(prev => prev.map(tile => 
      tile.id === id ? { ...tile, isRevealed: true } : tile
    ));
    setMultiplier(prev => prev * 1.1); // Simple multiplier logic
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center">
        <input 
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="p-2 rounded bg-gray-800 text-white"
          placeholder="Bet Amount"
        />
        <button 
          onClick={() => setIsGameActive(true)}
          className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
        >
          Start Game
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 w-full max-w-md">
        {tiles.map(tile => (
          <motion.button
            key={tile.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTileClick(tile.id)}
            className={`
              aspect-square rounded-lg ${
                tile.isRevealed 
                  ? 'bg-green-500' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }
            `}
          />
        ))}
      </div>

      <div className="text-2xl font-bold">
        Multiplier: {multiplier.toFixed(2)}x
      </div>
    </div>
  );
}