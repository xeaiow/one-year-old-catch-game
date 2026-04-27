# One-Year-Old Catch Party Game 🎉

A multiplayer interactive web game built for 小寶's first-birthday "catch" (抓周) ceremony. Family and friends join from their own phones to predict which items the baby will grab, and results are revealed in sync on the big screen.

## Features

- 🎯 **Guess**: Each participant picks N items, predicting what the baby will catch
- 🎊 **Reveal**: The host enters the actual results; the big screen reveals winners in sync
- 🎮 **Bingo Mode**: Choices and results presented in a Bingo layout
- 👶 **Character Select**: Each player picks a cute character avatar
- 📺 **Classroom Big-Screen View**: Designed for projection at the venue
- 🔁 **Auto-complete Participants**: Real-time name search, prevents duplicate joins
- 🛠️ **Admin Dashboard**: Manage players, items, and view results & stats

## Tech Stack

### Frontend (`/`)
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn-ui (Radix UI)
- framer-motion / motion for animations
- React Router, TanStack Query
- canvas-confetti for celebration effects

### Backend (`/api`)
- Bun + Elysia
- Supabase (PostgreSQL) for data storage
- JWT-based admin authentication

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Index | Enter your name to join the game |
| `/character` | CharacterSelect | Pick a character avatar |
| `/guess` | Guess | Guess which items the baby will grab |
| `/guess-success` | GuessSuccess | Submission confirmation |
| `/reveal` | Reveal | Reveal the actual catch results |
| `/bingo` | Bingo | Bingo presentation mode |
| `/classroom` | Classroom | Big-screen viewing layout |
| `/catch` | OneYearOldCatch | Showcase of catch items |

## Quick Start

### Prerequisites
- Node.js & pnpm
- Bun
- A Supabase project

### Frontend

```bash
pnpm install
pnpm dev
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

### Backend

See [`api/README.md`](./api/README.md) for full backend documentation.

```bash
cd api
bun install
cp .env.example .env   # fill in Supabase and admin settings
bun run dev
```

### Database Migration

Run the SQL files under `supabase/migrations/` in the Supabase Dashboard's SQL Editor.

## Project Structure

```
.
├── src/                  # Frontend app
│   ├── pages/            # Route pages
│   ├── components/       # UI, bingo, guess, reveal subcomponents
│   ├── integrations/     # Supabase client
│   ├── hooks/ lib/       # Custom hooks and API helpers
├── api/                  # Bun + Elysia backend
│   └── src/routes/       # Public and admin endpoints
├── supabase/migrations/  # Database schema
└── public/               # Static assets (item images, etc.)
```
