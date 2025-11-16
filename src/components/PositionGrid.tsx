import React from 'react';
import { Player, PlayerPosition, POSITIONS } from '../types';

interface PositionGridProps {
  lineup: PlayerPosition[];
  players: Player[];
  showRatings?: boolean;
}

export const PositionGrid: React.FC<PositionGridProps> = ({ lineup, players, showRatings = false }) => {
  const getPlayerForPosition = (position: string) => {
    const assignment = lineup.find(l => l.position === position);
    if (!assignment) return null;
    return players.find(p => p.id === assignment.playerId);
  };

  const getPlayerRating = (player: Player, position: string): number | null => {
    const rating = player.ratings.find(r => r.position === position);
    return rating ? rating.rating : null;
  };

  // Layout positions on a football pitch
  const positionLayout = {
    GK: { row: 5, col: 1 },
    LB: { row: 4, col: 2 },
    CB1: { row: 3, col: 2 },
    CB2: { row: 2, col: 2 },
    RB: { row: 1, col: 2 },
    LM: { row: 4, col: 3 },
    CM1: { row: 3, col: 3 },
    CM2: { row: 2, col: 3 },
    RM: { row: 1, col: 3 },
    LW: { row: 4, col: 4 },
    ST: { row: 3, col: 4 },
    RW: { row: 1, col: 4 },
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Current Lineup</h2>

      {/* Football pitch grid */}
      <div className="relative bg-gradient-to-b from-pitch-light to-pitch-dark rounded-lg p-6 shadow-xl">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white"></div>
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white"></div>
        </div>

        {/* Position grid */}
        <div className="relative grid grid-cols-4 gap-4" style={{ minHeight: '500px' }}>
          {POSITIONS.map(position => {
            const player = getPlayerForPosition(position);
            const layout = positionLayout[position as keyof typeof positionLayout];
            const rating = player ? getPlayerRating(player, position) : null;

            return (
              <div
                key={position}
                className="flex items-center justify-center"
                style={{
                  gridRow: layout.row,
                  gridColumn: layout.col,
                }}
              >
                <div
                  className={`
                    relative w-full h-24 rounded-lg shadow-lg border-3
                    flex flex-col items-center justify-center
                    transition-all duration-200
                    ${player
                      ? 'bg-white border-blue-500 hover:shadow-xl hover:scale-105'
                      : 'bg-gray-200 border-gray-400 opacity-70'
                    }
                  `}
                >
                  {/* Position label */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-0.5 rounded text-xs font-bold">
                    {position}
                  </div>

                  {player ? (
                    <>
                      {/* Jersey number */}
                      <div className="text-3xl font-bold text-blue-600">
                        #{player.jerseyNumber}
                      </div>
                      {/* Player name */}
                      <div className="text-sm font-semibold text-gray-800 text-center px-1 truncate w-full">
                        {player.name}
                      </div>
                      {/* Rating badge */}
                      {showRatings && rating !== null && (
                        <div className="absolute -bottom-2 right-2 bg-yellow-400 text-yellow-900 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold border-2 border-yellow-600">
                          {rating}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-500 text-sm font-semibold">Empty</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pitch markings */}
        <div className="absolute bottom-4 left-4 right-4 h-20 border-2 border-white rounded opacity-30"></div>
        <div className="absolute top-4 left-4 right-4 h-20 border-2 border-white rounded opacity-30"></div>
      </div>

      {/* Statistics */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">{lineup.length}</div>
            <div className="text-sm text-gray-600">On Pitch</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{POSITIONS.length - lineup.length}</div>
            <div className="text-sm text-gray-600">Empty Spots</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {lineup.reduce((sum, assignment) => {
                const player = players.find(p => p.id === assignment.playerId);
                if (!player) return sum;
                const rating = getPlayerRating(player, assignment.position);
                return sum + (rating || 0);
              }, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayerManager;
