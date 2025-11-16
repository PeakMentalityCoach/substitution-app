import React, { useState } from 'react';
import { Player, POSITIONS } from '../types';

interface PlayerManagerProps {
  players: Player[];
  onSave: (players: Player[]) => void;
}

export const PlayerManager: React.FC<PlayerManagerProps> = ({ players, onSave }) => {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const emptyPlayer = (): Player => ({
    id: Date.now().toString(),
    name: '',
    jerseyNumber: 0,
    positions: [],
    ratings: []
  });

  const handleAddNew = () => {
    setEditingPlayer(emptyPlayer());
    setIsAdding(true);
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer({ ...player });
    setIsAdding(false);
  };

  const handleDelete = (playerId: string) => {
    if (confirm('Are you sure you want to delete this player?')) {
      const updated = players.filter(p => p.id !== playerId);
      onSave(updated);
    }
  };

  const handleSavePlayer = () => {
    if (!editingPlayer) return;

    if (!editingPlayer.name.trim()) {
      alert('Please enter a player name');
      return;
    }

    if (editingPlayer.jerseyNumber <= 0) {
      alert('Please enter a valid jersey number');
      return;
    }

    if (editingPlayer.positions.length === 0) {
      alert('Please select at least one position');
      return;
    }

    let updated: Player[];
    if (isAdding) {
      updated = [...players, editingPlayer];
    } else {
      updated = players.map(p => p.id === editingPlayer.id ? editingPlayer : p);
    }

    onSave(updated);
    setEditingPlayer(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingPlayer(null);
    setIsAdding(false);
  };

  const togglePosition = (position: string) => {
    if (!editingPlayer) return;

    const positions = editingPlayer.positions.includes(position)
      ? editingPlayer.positions.filter(p => p !== position)
      : [...editingPlayer.positions, position];

    // Update ratings accordingly
    const ratings = editingPlayer.ratings.filter(r => positions.includes(r.position));

    // Add default rating for new position
    if (!editingPlayer.positions.includes(position)) {
      ratings.push({ position, rating: 5 });
    }

    setEditingPlayer({ ...editingPlayer, positions, ratings });
  };

  const updateRating = (position: string, rating: number) => {
    if (!editingPlayer) return;

    const ratings = editingPlayer.ratings.map(r =>
      r.position === position ? { ...r, rating } : r
    );

    setEditingPlayer({ ...editingPlayer, ratings });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Player Management</h2>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 active:bg-green-800 transition-colors"
        >
          + Add Player
        </button>
      </div>

      {/* Player List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {players.map(player => (
          <div key={player.id} className="bg-white p-4 rounded-lg shadow-md border-2 border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-800">#{player.jerseyNumber} {player.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Positions: {player.positions.join(', ')}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(player)}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(player.id)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {editingPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">
              {isAdding ? 'Add New Player' : 'Edit Player'}
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={editingPlayer.name}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg"
                  placeholder="Player name"
                />
              </div>

              {/* Jersey Number */}
              <div>
                <label className="block text-sm font-semibold mb-2">Jersey Number</label>
                <input
                  type="number"
                  value={editingPlayer.jerseyNumber || ''}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, jerseyNumber: parseInt(e.target.value) || 0 })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg"
                  placeholder="1-99"
                />
              </div>

              {/* Positions */}
              <div>
                <label className="block text-sm font-semibold mb-2">Positions (select all that apply)</label>
                <div className="grid grid-cols-3 gap-2">
                  {POSITIONS.map(pos => (
                    <button
                      key={pos}
                      onClick={() => togglePosition(pos)}
                      className={`px-4 py-3 rounded-lg font-semibold text-lg transition-colors ${
                        editingPlayer.positions.includes(pos)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              {editingPlayer.positions.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Position Ratings (1-10)</label>
                  <div className="space-y-2">
                    {editingPlayer.positions.map(pos => {
                      const rating = editingPlayer.ratings.find(r => r.position === pos);
                      return (
                        <div key={pos} className="flex items-center gap-4">
                          <span className="w-16 font-semibold">{pos}:</span>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={rating?.rating || 5}
                            onChange={(e) => updateRating(pos, parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <span className="w-8 text-center font-bold text-lg">{rating?.rating || 5}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSavePlayer}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 active:bg-green-800 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600 active:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PlayerManager;
