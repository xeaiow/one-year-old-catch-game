const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface Player {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  image_url: string;
}

export interface GameResultPayload {
  player_name: string;
  avatar_seed: string;
  selected_items: string[];
  guessed_gender: "male" | "female";
}

export interface MatchedPlayer {
  id: string;
  player_name: string;
  avatar_seed: string;
  selected_items: string[];
  guessed_gender: string;
  match_count: number;
}

export interface MatchesResult {
  match3: MatchedPlayer[];
  match2: MatchedPlayer[];
  match1: MatchedPlayer[];
  match0: MatchedPlayer[];
  total: number;
}

// 檢查玩家是否已參加過
export async function checkPlayerExists(name: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/game-results/check?name=${encodeURIComponent(name)}`);
  const data = await res.json();
  return data.exists;
}

// 玩家名稱自動補全
export async function fetchPlayersAutocomplete(query: string): Promise<Player[]> {
  const res = await fetch(`${API_BASE}/api/players/autocomplete?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.players;
}

// 取得所有物品
export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/api/items`);
  const data = await res.json();
  return data.items;
}

// 提交遊戲結果
export async function submitGameResult(payload: GameResultPayload): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/api/game-results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// 查詢配對結果
export async function fetchMatches(itemIds: string[]): Promise<MatchesResult> {
  const res = await fetch(`${API_BASE}/api/game-results/matches?items=${itemIds.join(",")}`);
  return res.json();
}

export interface GenderMatchesResult {
  correct: MatchedPlayer[];
  incorrect: MatchedPlayer[];
  total: number;
}

// 查詢性別配對結果
export async function fetchGenderMatches(gender: "male" | "female"): Promise<GenderMatchesResult> {
  const res = await fetch(`${API_BASE}/api/game-results/gender-matches?gender=${gender}`);
  return res.json();
}

export interface RandomPlayer {
  id: string;
  player_name: string;
  avatar_seed: string;
}

// 取得隨機玩家
export async function fetchRandomPlayer(): Promise<RandomPlayer | null> {
  const res = await fetch(`${API_BASE}/api/game-results/random`);
  const data = await res.json();
  return data.player;
}

// 取得所有已參加遊戲的玩家
export async function fetchAllGameResults(): Promise<RandomPlayer[]> {
  const res = await fetch(`${API_BASE}/api/game-results`);
  const data = await res.json();
  return data.players;
}

// 清除所有遊戲結果
export async function clearAllGameResults(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/api/game-results/clear`, {
    method: "DELETE",
  });
  return res.json();
}
