const API_BASE = "http://localhost:3001";

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
