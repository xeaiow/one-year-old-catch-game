-- Add avatar_seed column to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS avatar_seed TEXT;
