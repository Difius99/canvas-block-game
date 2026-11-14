import { request } from "./client";

export type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
};

export type Leaderboard = {
  entries: LeaderboardEntry[];
  // место текущего игрока, если он вошёл и у него есть результат
  me: LeaderboardEntry | null;
};

type SubmitScoreResponse = {
  bestScore: number;
  isNewBest: boolean;
};

export function fetchLeaderboard(limit = 10): Promise<Leaderboard> {
  return request<Leaderboard>(`/leaderboard?limit=${limit}`);
}

export function submitScore(score: number): Promise<SubmitScoreResponse> {
  return request<SubmitScoreResponse>("/scores", {
    method: "POST",
    body: { score },
  });
}
