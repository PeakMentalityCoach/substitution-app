import React, { useState } from 'react';
import { Player, PlayerPosition, POSITIONS } from '../types';
import { optimizePositions, calculateLineupScore } from '../utils/optimizer';

interface SubstitutionPanelProps {
  lineup: PlayerPosition[];
  bench: string[];
  players: Player[];
  onSubstitute: (newLineup: PlayerPosition[], newBench: string[]) => void;
}

export const SubstitutionPanel: React.FC<SubstitutionPanelProps> = ({
  lineup,
  bench,
  players,
  onSubstitute
}) => {
  const [playerOut, setPlayerOut] = useState<string>('');
  const [playerIn, setPlayerIn] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewLineup, setPreviewLineup] = useState<PlayerPosition[]>([]);

  const playersOnPitch = lineup.map(l => players.find(p => p.id === l.playerId)!).filter(Boolean);
  const playersOnBench = bench.map(id => players.find(p => p.id === id)!).filter(Boolean);

  const handlePreview = () => {
    if (!playerOut || !playerIn) {
      alert('Please select both players');
      return;
    }

    // Remove player going out, add player coming in
    const updatedPlayers = playersOnPitch
      .filter(p => p.id !== playerOut)
      .concat(players.find(p => p.id === playerIn)!);

    // Recalculate optimal positions
    const newLineup = optimizePositions(updatedPlayers, [...POSITIONS]);

    setPreviewLineup(newLineup);
    setShowPreview(true);
  };

  const handleConfirmSubstitution = () => {
    if (!playerOut || !playerIn || previewLineup.length === 0) return;

    // Update bench
    const newBench = bench
      .filter(id => id !== playerIn)
      .concat(playerOut);

    onSubstitute(previewLineup, newBench);

    // Reset
    setPlayerOut('');
    setPlayerIn('');
    setShowPreview(false);
    setPreviewLineup([]);
  };

  const handleCancel = () => {
    setShowPreview(false);
    setPreviewLineup([]);
  };

  const getPlayerPosition = (playerId: string): string | null => {
    const assignment = lineup.find(l => l.playerId === playerId);
    return assignment ? assignment.position : null;
  };

  const getPlayerInfo = (playerId: string) => {
    return players.find(p => p.id === playerId);
  };

  const currentScore = calculateLineupScore(lineup, players);
  const previewScore = showPreview ? calculateLineupScore(previewLineup, players) : 0;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Make Substitution</h2>

      {/* Current lineup score */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <div className="text-center">
          <div className="text-sm text-gray-600">Current Lineup Quality Score</div>
          <div className="text-4xl font-bold text-blue-600">{currentScore}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Player OUT */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-red-200">
          <h3 className="text-xl font-bold text-red-600 mb-4">Player OUT (from pitch)</h3>
          <select
            value={playerOut}
            onChange={(e) => setPlayerOut(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg mb-4"
          >
            <option value="">-- Select Player --</option>
            {playersOnPitch.map(player => {
              const position = getPlayerPosition(player.id);
              return (
                <option key={player.id} value={player.id}>
                  #{player.jerseyNumber} {player.name} ({position})
                </option>
              );
            })}
          </select>

          {playerOut && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-semibold text-gray-800">
                #{getPlayerInfo(playerOut)?.jerseyNumber} {getPlayerInfo(playerOut)?.name}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Current Position: {getPlayerPosition(playerOut)}
              </div>
            </div>
          )}
        </div>

        {/* Player IN */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-200">
          <h3 className="text-xl font-bold text-green-600 mb-4">Player IN (from bench)</h3>
          <select
            value={playerIn}
            onChange={(e) => setPlayerIn(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg mb-4"
          >
            <option value="">-- Select Player --</option>
            {playersOnBench.map(player => (
              <option key={player.id} value={player.id}>
                #{player.jerseyNumber} {player.name}
              </option>
            ))}
          </select>

          {playerIn && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-semibold text-gray-800">
                #{getPlayerInfo(playerIn)?.jerseyNumber} {getPlayerInfo(playerIn)?.name}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Can play: {getPlayerInfo(playerIn)?.positions.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Button */}
      {!showPreview && (
        <button
          onClick={handlePreview}
          disabled={!playerOut || !playerIn}
          className={`
            w-full py-4 rounded-lg text-xl font-bold transition-colors mb-4
            ${playerOut && playerIn
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Preview Optimized Lineup
        </button>
      )}

      {/* Preview */}
      {showPreview && previewLineup.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg border-3 border-blue-500 mb-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Preview: New Lineup</h3>

          {/* Score comparison */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-600">Current</div>
              <div className="text-2xl font-bold text-gray-700">{currentScore}</div>
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">New</div>
              <div className={`text-2xl font-bold ${previewScore >= currentScore ? 'text-green-600' : 'text-red-600'}`}>
                {previewScore}
                {previewScore > currentScore && ' ↑'}
                {previewScore < currentScore && ' ↓'}
              </div>
            </div>
          </div>

          {/* Position changes */}
          <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
            {previewLineup.map(assignment => {
              const player = players.find(p => p.id === assignment.playerId);
              const oldAssignment = lineup.find(l => l.playerId === assignment.playerId);
              const isNew = assignment.playerId === playerIn;
              const positionChanged = oldAssignment && oldAssignment.position !== assignment.position;

              return (
                <div
                  key={assignment.playerId}
                  className={`
                    p-3 rounded-lg border-2
                    ${isNew ? 'bg-green-50 border-green-500' :
                      positionChanged ? 'bg-yellow-50 border-yellow-500' :
                      'bg-gray-50 border-gray-300'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold">#{player?.jerseyNumber} {player?.name}</span>
                      {isNew && <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded">NEW</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {positionChanged && oldAssignment && (
                        <>
                          <span className="text-gray-500 line-through">{oldAssignment.position}</span>
                          <span className="text-gray-400">→</span>
                        </>
                      )}
                      <span className={`font-bold ${isNew || positionChanged ? 'text-blue-600' : 'text-gray-700'}`}>
                        {assignment.position}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleConfirmSubstitution}
              className="flex-1 bg-green-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-green-700 active:bg-green-800 transition-colors"
            >
              Confirm Substitution
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white py-4 rounded-lg text-xl font-bold hover:bg-gray-600 active:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bench display */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Bench ({playersOnBench.length} players)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {playersOnBench.map(player => (
            <div key={player.id} className="p-3 bg-gray-100 rounded-lg border border-gray-300">
              <div className="font-semibold text-gray-800">#{player.jerseyNumber}</div>
              <div className="text-sm text-gray-600 truncate">{player.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
