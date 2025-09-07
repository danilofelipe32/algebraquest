export enum GameState {
  START = 'start',
  SETUP = 'setup',
  PLAYING = 'playing',
  GAME_OVER = 'game_over',
  LEADERBOARD = 'leaderboard',
}

export type Difficulty = 'Fácil' | 'Médio' | 'Difícil';

export interface Player {
  id: number;
  name: string;
  score: number;
  position: number; // index on the board
  color: string; // css class for the pawn
}

export interface ScoreEntry {
  name: string;
  score: number;
  timestamp: number;
}

export type BoardSpaceType = 'start' | 'challenge' | 'safe' | 'finish' | 'lucky' | 'unlucky';

export interface BoardSpace {
    type: BoardSpaceType;
    title: string;
}

export interface Challenge {
  id: number;
  question: string;
  getSolution: () => number;
}

// Fix: Add LevelType for the Level component.
export interface LevelType {
  id: number;
  question: string;
  getSolution: () => number;
  hint?: string;
}

export type TurnState = 'ROLL_DICE' | 'MOVING' | 'ACTION' | 'WAITING';