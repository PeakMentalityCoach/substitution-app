import React, { useState } from 'react';
import { Player, PlayerPosition, POSITIONS } from '../types';
import { optimizePositions } from '../utils/optimizer';

interface StartingLineupProps {
  players: Player[];
  onSetLineup: (lineup: PlayerPosition[], bench: string[]) => void;
}

export const StartingLineup: React.FC<StartingLineupProps> = ({ players, onSetLineup }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());

  const togglePlayer = (playerId: string) => {
    const newSelected = new Set(selectedPlayers);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      if (newSelected.size >= 12) {
        alert('You can only select up to 12 players for the starting lineup');
        return;
      }
      newSelected.add(playerId);
    }
    setSelectedPlayers(newSelected);
  };

  const handleOptimizeAndSet = () => {
    if (selectedPlayers.size === 0) {
      alert('Please select at least one player');
      return;
    }

    const selectedPlayerObjects = players.filter(p => selectedPlayers.has(p.id));
    const optimizedLineup = optimizePositions(selectedPlayerObjects, [...POSITIONS]);

    // Players not in lineup go to bench
    const bench = players
      .filter(p => !selectedPlayers.has(p.id))
      .map(p => p.id);

    onSetLineup(optimizedLineup, bench);
  };

  const handleSelectAll = () => {
    const all = new Set(players.slice(0, 12).map(p => p.id));
    setSelectedPlayers(all);
  };

  const handleClearAll = () => {
    setSelectedPlayers(new Set());
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Select Starting Lineup</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <p className="text-lg text-gray-700 mb-2">
          <strong>Instructions:</strong> Select up to 12 players for your starting lineup.
          The system will automatically assign them to optimal positions based on their ratings.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleSelectAll}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
          >
            Select First 12
          </button>
          <button
            onClick={handleClearAll}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 active:bg-gray-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Player selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {players.map(player => (
          <div
            key={player.id}
            onClick={() => togglePlayer(player.id)}
            className={`
              p-4 rounded-lg border-3 cursor-pointer transition-all duration-200
              ${selectedPlayers.has(player.id)
                ? 'bg-green-100 border-green-500 shadow-lg scale-105'
                : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {/* Checkbox */}
              <div className={`
                w-8 h-8 rounded-full border-3 flex items-center justify-center
                ${selectedPlayers.has(player.id)
                  ? 'bg-green-500 border-green-600'
                  : 'bg-white border-gray-400'
                }
              `}>
                {selectedPlayers.has(player.id) && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Player info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">
                  #{player.jerseyNumber} {player.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {player.positions.join(', ')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg rating: {(player.ratings.reduce((sum, r) => sum + r.rating, 0) / player.ratings.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action button */}
      <div className="sticky bottom-0 bg-white p-4 border-t-4 border-gray-200 shadow-lg">
        <button
          onClick={handleOptimizeAndSet}
          disabled={selectedPlayers.size === 0}
          className={`
            w-full py-4 rounded-lg text-xl font-bold transition-colors
            ${selectedPlayers.size > 0
              ? 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Optimize & Set Lineup ({selectedPlayers.size} players selected)
        </button>
      </div>
    </div>
  );
};
