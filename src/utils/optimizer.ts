import Munkres from 'munkres-js';
import { Player, PlayerPosition, POSITIONS } from '../types';

/**
 * Optimizes player positions using the Hungarian algorithm
 * Assigns each player to their best available position
 */
export function optimizePositions(
  players: Player[],
  requiredPositions: string[] = [...POSITIONS]
): PlayerPosition[] {
  if (players.length === 0) return [];

  // Build cost matrix
  // Rows = players, Columns = positions
  // Lower cost = better fit (we use negative ratings to minimize)
  const costMatrix: number[][] = [];

  players.forEach((player) => {
    const row: number[] = [];
    requiredPositions.forEach((position) => {
      // Check if player can play this position
      const canPlay = player.positions.includes(position);

      if (!canPlay) {
        // Very high cost for positions player can't play
        row.push(1000);
      } else {
        // Find rating for this position
        const rating = player.ratings.find(r => r.position === position);
        // Negative rating because we want to minimize cost (higher rating = lower cost)
        // If no rating, default to -5
        row.push(rating ? -rating.rating : -5);
      }
    });
    costMatrix.push(row);
  });

  // Pad matrix if needed (must be square for Hungarian algorithm)
  const size = Math.max(players.length, requiredPositions.length);

  // Pad rows (add dummy players)
  while (costMatrix.length < size) {
    costMatrix.push(new Array(requiredPositions.length).fill(1000));
  }

  // Pad columns (add dummy positions)
  costMatrix.forEach(row => {
    while (row.length < size) {
      row.push(1000);
    }
  });

  // Run Hungarian algorithm
  const munkres = new Munkres();
  const assignments = munkres.compute(costMatrix);

  // Convert assignments to PlayerPosition array
  const result: PlayerPosition[] = [];

  assignments.forEach(([playerIdx, positionIdx]) => {
    // Only include real players and real positions
    if (playerIdx < players.length && positionIdx < requiredPositions.length) {
      const player = players[playerIdx];
      const position = requiredPositions[positionIdx];

      // Only add if player can actually play this position
      if (player.positions.includes(position)) {
        result.push({
          playerId: player.id,
          position: position
        });
      }
    }
  });

  return result;
}

/**
 * Greedy fallback algorithm (simpler, but less optimal)
 * Assigns players to their highest-rated available position
 */
export function greedyOptimize(
  players: Player[],
  requiredPositions: string[] = [...POSITIONS]
): PlayerPosition[] {
  const result: PlayerPosition[] = [];
  const usedPositions = new Set<string>();
  const assignedPlayers = new Set<string>();

  // Sort players by their highest rating
  const sortedPlayers = [...players].sort((a, b) => {
    const maxA = Math.max(...a.ratings.map(r => r.rating), 0);
    const maxB = Math.max(...b.ratings.map(r => r.rating), 0);
    return maxB - maxA;
  });

  // First pass: assign players to their best available position
  sortedPlayers.forEach(player => {
    // Sort player's positions by rating
    const sortedPositions = [...player.ratings]
      .filter(r => requiredPositions.includes(r.position))
      .sort((a, b) => b.rating - a.rating);

    for (const rating of sortedPositions) {
      if (!usedPositions.has(rating.position)) {
        result.push({
          playerId: player.id,
          position: rating.position
        });
        usedPositions.add(rating.position);
        assignedPlayers.add(player.id);
        break;
      }
    }
  });

  // Second pass: assign remaining players to any available position they can play
  sortedPlayers.forEach(player => {
    if (assignedPlayers.has(player.id)) return;

    for (const position of player.positions) {
      if (requiredPositions.includes(position) && !usedPositions.has(position)) {
        result.push({
          playerId: player.id,
          position: position
        });
        usedPositions.add(position);
        assignedPlayers.add(player.id);
        break;
      }
    }
  });

  return result;
}

/**
 * Calculate the total quality score of a lineup
 */
export function calculateLineupScore(lineup: PlayerPosition[], players: Player[]): number {
  let totalScore = 0;

  lineup.forEach(assignment => {
    const player = players.find(p => p.id === assignment.playerId);
    if (player) {
      const rating = player.ratings.find(r => r.position === assignment.position);
      totalScore += rating ? rating.rating : 0;
    }
  });

  return totalScore;
}
