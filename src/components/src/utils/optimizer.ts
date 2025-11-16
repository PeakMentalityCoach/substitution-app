import { Player } from "../types";

export function optimizeLineup(players: Player[]) {
  if (!players || players.length === 0) return [];

  // Very simple fallback: choose the first 11 players for now
  // (We can upgrade to Hungarian algorithm once everything is stable)
  return players.slice(0, 11);
}
