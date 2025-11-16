export interface PositionRating {
  position: string;
  rating: number; // 1-10
}

export interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  positions: string[]; // Positions they can play
  ratings: PositionRating[]; // Optional ratings per position
}

export interface PlayerPosition {
  playerId: string;
  position: string;
}

export interface GameState {
  lineup: Player[];   // players currently on the pitch
  bench: Player[];    // players not on the pitch
}

export const POSITIONS = [
  'GK',    // Goalkeeper
  'LB',    // Left Back
  'CB1',   // Center Back 1
  'CB2',   // Center Back 2
  'RB',    // Right Back
  'LM',    // Left Midfielder
  'CM1',   // Center Midfielder 1
  'CM2',   // Center Midfielder 2
  'RM',    // Right Midfielder
  'LW',    // Left Winger
  'ST',    // Striker
  'RW',    // Right Winger
] as const;

export type Position = typeof POSITIONS[number];
