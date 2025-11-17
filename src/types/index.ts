export interface PositionRating {
  position: string;
  rating: number; // 1–10
}

export interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  positions: string[];
  ratings: PositionRating[];
}

export interface PlayerPosition {
  playerId: string;
  position: string;
}

export interface GameState {
  lineup: PlayerPosition[];   // players assigned to positions
  bench: string[];            // IDs of players on bench
  substitutions: {
    out: Player;
    in: Player;
  }[];
}

export const POSITIONS = [
  'GK',
  'LB',
  'CB1',
  'CB2',
  'RB',
  'LM',
  'CM1',
  'CM2',
  'RM',
  'LW',
  'ST',
  'RW',
] as const;

export type Position = typeof POSITIONS[number];
