import { Player, GameState } from '../types';

const PLAYERS_KEY = 'football_players';
const GAME_STATE_KEY = 'football_game_state';

export const storageUtils = {
  // Players
  savePlayers: (players: Player[]): void => {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  },

  loadPlayers: (): Player[] => {
    const data = localStorage.getItem(PLAYERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Game State
  saveGameState: (gameState: GameState): void => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  },

  loadGameState: (): GameState | null => {
    const data = localStorage.getItem(GAME_STATE_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Clear all data
  clearAll: (): void => {
    localStorage.removeItem(PLAYERS_KEY);
    localStorage.removeItem(GAME_STATE_KEY);
  },

  // Initialize with example data
  initializeExampleData: (): Player[] => {
    const examplePlayers: Player[] = [
      {
        id: '1',
        name: 'John Smith',
        jerseyNumber: 1,
        positions: ['GK'],
        ratings: [{ position: 'GK', rating: 9 }]
      },
      {
        id: '2',
        name: 'Mike Johnson',
        jerseyNumber: 2,
        positions: ['RB', 'CB1', 'CB2'],
        ratings: [
          { position: 'RB', rating: 8 },
          { position: 'CB1', rating: 7 },
          { position: 'CB2', rating: 7 }
        ]
      },
      {
        id: '3',
        name: 'David Brown',
        jerseyNumber: 3,
        positions: ['LB', 'CB1', 'CB2'],
        ratings: [
          { position: 'LB', rating: 8 },
          { position: 'CB1', rating: 7 },
          { position: 'CB2', rating: 7 }
        ]
      },
      {
        id: '4',
        name: 'Chris Wilson',
        jerseyNumber: 4,
        positions: ['CB1', 'CB2'],
        ratings: [
          { position: 'CB1', rating: 9 },
          { position: 'CB2', rating: 9 }
        ]
      },
      {
        id: '5',
        name: 'Tom Davis',
        jerseyNumber: 5,
        positions: ['CB1', 'CB2', 'CM1'],
        ratings: [
          { position: 'CB1', rating: 8 },
          { position: 'CB2', rating: 8 },
          { position: 'CM1', rating: 7 }
        ]
      },
      {
        id: '6',
        name: 'James Miller',
        jerseyNumber: 6,
        positions: ['CM1', 'CM2'],
        ratings: [
          { position: 'CM1', rating: 9 },
          { position: 'CM2', rating: 8 }
        ]
      },
      {
        id: '7',
        name: 'Robert Garcia',
        jerseyNumber: 7,
        positions: ['RW', 'RM', 'ST'],
        ratings: [
          { position: 'RW', rating: 9 },
          { position: 'RM', rating: 8 },
          { position: 'ST', rating: 7 }
        ]
      },
      {
        id: '8',
        name: 'Daniel Martinez',
        jerseyNumber: 8,
        positions: ['CM1', 'CM2', 'LM', 'RM'],
        ratings: [
          { position: 'CM1', rating: 8 },
          { position: 'CM2', rating: 8 },
          { position: 'LM', rating: 7 },
          { position: 'RM', rating: 7 }
        ]
      },
      {
        id: '9',
        name: 'Kevin Rodriguez',
        jerseyNumber: 9,
        positions: ['ST', 'LW', 'RW'],
        ratings: [
          { position: 'ST', rating: 10 },
          { position: 'LW', rating: 8 },
          { position: 'RW', rating: 8 }
        ]
      },
      {
        id: '10',
        name: 'Alex Lopez',
        jerseyNumber: 10,
        positions: ['LW', 'LM', 'ST'],
        ratings: [
          { position: 'LW', rating: 9 },
          { position: 'LM', rating: 8 },
          { position: 'ST', rating: 7 }
        ]
      },
      {
        id: '11',
        name: 'Mark Taylor',
        jerseyNumber: 11,
        positions: ['LM', 'LW', 'CM1'],
        ratings: [
          { position: 'LM', rating: 8 },
          { position: 'LW', rating: 7 },
          { position: 'CM1', rating: 7 }
        ]
      },
      {
        id: '12',
        name: 'Steve Anderson',
        jerseyNumber: 12,
        positions: ['RM', 'RW', 'CM2'],
        ratings: [
          { position: 'RM', rating: 8 },
          { position: 'RW', rating: 7 },
          { position: 'CM2', rating: 7 }
        ]
      },
      {
        id: '13',
        name: 'Paul Thomas',
        jerseyNumber: 13,
        positions: ['GK'],
        ratings: [{ position: 'GK', rating: 7 }]
      },
      {
        id: '14',
        name: 'Brian Jackson',
        jerseyNumber: 14,
        positions: ['RB', 'RM', 'CB2'],
        ratings: [
          { position: 'RB', rating: 7 },
          { position: 'RM', rating: 6 },
          { position: 'CB2', rating: 6 }
        ]
      },
      {
        id: '15',
        name: 'Ryan White',
        jerseyNumber: 15,
        positions: ['LB', 'LM', 'CB1'],
        ratings: [
          { position: 'LB', rating: 7 },
          { position: 'LM', rating: 6 },
          { position: 'CB1', rating: 6 }
        ]
      }
    ];

    storageUtils.savePlayers(examplePlayers);
    return examplePlayers;
  }
};
