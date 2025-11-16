import React, { useState, useEffect } from 'react';
import { PlayerManager } from './components/PlayerManager';
import { StartingLineup } from './components/StartingLineup';
import { SubstitutionPanel } from './components/SubstitutionPanel';
import PositionGrid from './components/PositionGrid';

import * as storageUtils from './utils/storage';
import { Player, GameState } from './types';

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentView, setCurrentView] =
    useState<'players' | 'lineup' | 'game'>('players');

  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const storedPlayers = storageUtils.loadPlayers();
    const storedState = storageUtils.loadGameState();

    if (storedPlayers) setPlayers(storedPlayers);
    if (storedState) setGameState(storedState);
  }, []);

  useEffect(() => {
    storageUtils.savePlayers(players);
  }, [players]);

  useEffect(() => {
    storageUtils.saveGameState(gameState);
  }, [gameState]);

  function optimizeLineup(p: Player[]): Player[] {
    if (!Array.isArray(p) || p.length === 0) return [];
    const sorted = [...p].sort((a, b) =>
      (a.positions[0] ?? '').localeCompare(b.positions[0] ?? '')
    );
    return sorted.slice(0, 11);
  }

  function handleSavePlayers(updated: Player[]) {
    setPlayers(updated);
  }

 function handleSetLineup(selectedPlayers: Player[]) {
  const lineup = selectedPlayers;
  const bench = players.filter(p => !selectedPlayers.includes(p));

  setGameState({
    lineup,
    bench,
    substitutions: [],
  });

  setCurrentView('game');
}

function handleSubstitute(outPlayer: Player, inPlayer: Player) {
  if (!gameState) return;

  const newLineup = gameState.lineup
    .filter(p => p.id !== outPlayer.id)
    .concat(inPlayer);

  const newBench = gameState.bench
    .filter(p => p.id !== inPlayer.id)
    .concat(outPlayer);

  setGameState({
    ...gameState,
    lineup: newLineup,
    bench: newBench,
    substitutions: [
      ...gameState.substitutions,
      { out: outPlayer, in: inPlayer },
    ],
  });
}

  function handleSubstitute(outPlayer: Player, inPlayer: Player) {
    if (!gameState) return;

    const newLineup = gameState.lineup
      .filter((p) => p.id !== outPlayer.id)
      .concat(inPlayer);

    const newBench = gameState.bench
      .filter((p) => p.id !== inPlayer.id)
      .concat(outPlayer);

    setGameState({
      ...gameState,
      lineup: newLineup,
      bench: newBench,
      substitutions: [
        ...gameState.substitutions,
        { out: outPlayer, in: inPlayer },
      ],
    });
  }

  function handleResetGame() {
    setGameState(null);
    setCurrentView('players');
  }

  function handleClearAllData() {
    if (!confirm('Delete ALL players and ALL data?')) return;
    storageUtils.clearAll();
    setPlayers([]);
    setGameState(null);
    setCurrentView('players');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-center">
            Football Substitution Manager
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 justify-center flex-wrap pb-4">
          <button
            onClick={() => setCurrentView('players')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentView === 'players'
                ? 'bg-white text-green-700 shadow'
                : 'bg-green-500 text-white hover:bg-green-400'
            }`}
          >
            Players
          </button>

          <button
            onClick={() => setCurrentView('lineup')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentView === 'lineup'
                ? 'bg-white text-green-700 shadow'
                : 'bg-green-500 text-white hover:bg-green-400'
            }`}
          >
            Set Lineup
          </button>

          <button
            onClick={() => setCurrentView('game')}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentView === 'game'
                ? 'bg-white text-green-700 shadow'
                : 'bg-green-500 text-white hover:bg-green-400'
            }`}
          >
            Game
          </button>
        </div>

        {/* Game Reset / Clear Buttons */}
        <div className="flex gap-2 justify-center mt-2 mb-4">
          {gameState && (
            <button
              onClick={handleResetGame}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
            >
              Reset Game
            </button>
          )}

          <button
            onClick={handleClearAllData}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
          >
            Clear ALL Data
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* PLAYERS */}
        {currentView === 'players' && (
          <PlayerManager players={players} onSave={handleSavePlayers} />
        )}

        {/* LINEUP */}
        {currentView === 'lineup' && (
          <StartingLineup players={players} onSetLineup={handleSetLineup} />
        )}

        {/* GAME — but only if lineup exists */}
        {currentView === 'game' && gameState.lineup.length > 0 && (
          <div className="flex flex-col gap-6">
            <PositionGrid
              players={gameState.currentlineup}
              showRatings={true}
              lineup={gameState.currentlineup}
            />

            <SubstitutionPanel
              players={players}
            players={gameState.currentLineup}
          lineup={gameState.currentLineup}
              onSubstitute={handleSubstitute}
            />
          </div>
        )}

        {/* GAME — but lineup not set yet */}
      currentView === 'game' && gameState.currentLineup.length > 0 &&
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">No Active Game</h2>
            <p className="text-gray-700 mb-6">
              Please set up your starting lineup first.
            </p>
            <button
              onClick={() => setCurrentView('lineup')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-green-700"
            >
              Set Lineup
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            Football Substitution Manager — Optimise your team intelligently
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
