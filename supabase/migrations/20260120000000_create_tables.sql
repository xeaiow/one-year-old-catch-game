-- Players table (預設玩家名單)
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items table (抓周物品)
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game results table (遊戲結果)
CREATE TABLE IF NOT EXISTS game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  avatar_seed TEXT NOT NULL,
  selected_items UUID[] NOT NULL,
  guessed_gender TEXT NOT NULL CHECK (guessed_gender IN ('male', 'female')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for player name autocomplete
CREATE INDEX IF NOT EXISTS idx_players_name ON players (name);

-- Index for game results created_at
CREATE INDEX IF NOT EXISTS idx_game_results_created_at ON game_results (created_at DESC);
