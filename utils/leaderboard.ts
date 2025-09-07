import { ScoreEntry } from '../types';

const LEADERBOARD_KEY = 'algebraQuestLeaderboard';
const MAX_SCORES = 10;

export const getScores = (): ScoreEntry[] => {
  try {
    const scoresJSON = localStorage.getItem(LEADERBOARD_KEY);
    if (!scoresJSON) {
      return [];
    }
    const scores = JSON.parse(scoresJSON) as ScoreEntry[];
    // Sort by score descending, then by timestamp descending for tie-breaking
    return scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.timestamp - a.timestamp;
    });
  } catch (error) {
    console.error("Failed to retrieve scores from localStorage", error);
    return [];
  }
};

export const saveScore = (newScore: ScoreEntry) => {
  try {
    const scores = getScores();
    scores.push(newScore);
    
    const sortedScores = scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.timestamp - a.timestamp;
    });

    const topScores = sortedScores.slice(0, MAX_SCORES);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topScores));
  } catch (error) {
    console.error("Failed to save score to localStorage", error);
  }
};
