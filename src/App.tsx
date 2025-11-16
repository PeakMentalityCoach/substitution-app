import React, { useState, useEffect } from 'react';
import { Player, PlayerPosition, GameState } from './types';
import { storageUtils } from './utils/storage';
import { PlayerManager } from './components/PlayerManager';
import { PositionGrid } from './components/PositionGrid';
import { StartingLineup } from './components/StartingLineup';
import { SubstitutionPanel } from './components/SubstitutionPanel';
import './App.css';

type View = 'players' | 'lineup' | 'game';

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentView, setCurrentView] = useState<View>('players');
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Load data on mount
  useEffect(() => {
    let loadedPlayers = storageUtils.loadPlayers();

    // Initialize with example data if no players exist
    if (loadedPlayers.length === 0) {
      loadedPlayers = storageUtils.initializeExampleData();
    }

    setPlayers(loadedPlayers);

    const savedGameState = storageUtils.loadGameState();
    if (savedGameState) {
      setGameState(savedGameState);
    }
  }, []);

  // Save players whenever they change
  useEffect(() => {
    if (players.length > 0) {
      storageUtils.savePlayers(players);
    }
  }, [players]);

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState) {
      storageUtils.saveGameState(gameState);
    }
  }, [gameState]);

  const handleSavePlayers = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
  };

  const handleSetLineup = (lineup: PlayerPosition[], bench: string[]) => {
    const newGameState: GameState = {
      players,
      currentLineup: lineup,
      bench
    };
    setGameState(newGameState);
    setCurrentView('game');
  };

  const handleSubstitute = (newLineup: PlayerPosition[], newBench: string[]) => {
    if (gameState) {
      const updatedGameState: GameState = {
        ...gameState,
        currentLineup: newLineup,
        bench: newBench
      };
      setGameState(updatedGameState);
    }
  };

  const handleResetGame = () => {
    if (confirm('Are you sure you want to reset the game? This will clear the current lineup.')) {
      setGameState(null);
      storageUtils.saveGameState({ players: [], currentLineup: [], bench: [] });
      setCurrentView('lineup');
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear ALL data? This will remove all players and game state.')) {
      storageUtils.clearAll();
      const examplePlayers = storageUtils.initializeExampleData();
      setPlayers(examplePlayers);
      setGameState(null);
      setCurrentView('players');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            ⚽ Football Substitution Manager
          </h1>

          {/* Navigation */}
          <nav className="flex gap-2 justify-center flex-wrap">
            <button
              onClick={() => setCurrentView('players')}
              className={`
                px-6 py-3 rounded-lg font-semibold text-lg transition-all
                ${currentView === 'players'
                  ? 'bg-white text-green-700 shadow-lg scale-105'
                  : 'bg-green-500 text-white hover:bg-green-400'
                }
              `}
            >
              Players
            </button>
            <button
              onClick={() => setCurrentView('lineup')}
              className={`
                px-6 py-3 rounded-lg font-semibold text-lg transition-all
                ${currentView === 'lineup'
                  ? 'bg-white text-green-700 shadow-lg scale-105'
                  : 'bg-green-500 text-white hover:bg-green-400'
                }
              `}
            >
              Set Lineup
            </button>
            <button
              onClick={() => setCurrentView('game')}
              disabled={!gameState}
              className={`
                px-6 py-3 rounded-lg font-semibold text-lg transition-all
                ${currentView === 'game'
                  ? 'bg-white text-green-700 shadow-lg scale-105'
                  : gameState
                    ? 'bg-green-500 text-white hover:bg-green-400'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }
              `}
            >
              Game
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            {gameState && (
              <button
                onClick={handleResetGame}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-semibold"
              >
                Reset Game
              </button>
            )}
            <button
              onClick={handleClearAllData}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6">
        {currentView === 'players' && (
          <PlayerManager players={players} onSave={handleSavePlayers} />
        )}

        {currentView === 'lineup' && (
          <StartingLineup players={players} onSetLineup={handleSetLineup} />
        )}

        {currentView === 'game' && gameState && (
          <div className="space-y-6">
            <PositionGrid
              lineup={gameState.currentLineup}
              players={players}
              showRatings={true}
            />
            <SubstitutionPanel
              lineup={gameState.currentLineup}
              bench={gameState.bench}
              players={players}
              onSubstitute={handleSubstitute}
            />
          </div>
        )}

        {currentView === 'game' && !gameState && (
          <div className="p-8 text-center">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Active Game</h2>
              <p className="text-gray-600 mb-6">
                Please set up your starting lineup first.
              </p>
              <button
                onClick={() => setCurrentView('lineup')}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-700"
              >
                Set Lineup
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            Football Substitution Manager - Optimize your team positions with smart algorithms
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Using Hungarian Algorithm for optimal player positioning
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
