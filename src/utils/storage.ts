import { Player, GameState } from '../types';

const PLAYERS_KEY = 'players';
const GAMESTATE_KEY = 'gameState';

export function savePlayers(players: Player[]) {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function loadPlayers(): Player[] {
  const raw = localStorage.getItem(PLAYERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveGameState(state: GameState) {
  localStorage.setItem(GAMESTATE_KEY, JSON.stringify(state));
}

export function loadGameState(): GameState | null {
  const raw = localStorage.getItem(GAMESTATE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAll() {
  localStorage.removeItem(PLAYERS_KEY);
  localStorage.removeItem(GAMESTATE_KEY);
}
