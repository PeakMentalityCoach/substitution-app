import { Player, GameState } from '../types';

const PLAYERS_KEY = 'players';
const GAMESTATE_KEY = 'gameState';

export function loadPlayers(): Player[] {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePlayers(players: Player[]) {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(GAMESTATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveGameState(state: GameState | null) {
  if (state) {
    localStorage.setItem(GAMESTATE_KEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(GAMESTATE_KEY);
  }
}

export function clearAll() {
  localStorage.removeItem(PLAYERS_KEY);
  localStorage.removeItem(GAMESTATE_KEY);
}
