# API Backend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 建立 Elysia + Bun 後端 API，支援遊戲結果紀錄、統計分析、管理員後台

**Architecture:** 後端放在 `api/` 目錄，使用 Elysia 框架搭配 Supabase PostgreSQL。公開 API 無需認證，管理員 API 需 JWT 驗證。

**Tech Stack:** Bun, Elysia, Supabase (PostgreSQL), JWT

---

## Task 1: 初始化 Elysia 專案

**Files:**
- Create: `api/package.json`
- Create: `api/tsconfig.json`
- Create: `api/src/index.ts`

**Step 1: 建立 api 目錄並初始化**

```bash
cd /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend
mkdir -p api/src
cd api
bun init -y
```

**Step 2: 安裝依賴**

```bash
cd /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend/api
bun add elysia @elysiajs/cors @elysiajs/jwt @supabase/supabase-js
```

**Step 3: 建立基本 server**

寫入 `api/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .get("/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
```

**Step 4: 更新 package.json scripts**

修改 `api/package.json`，加入 scripts:

```json
{
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "start": "bun run src/index.ts"
  }
}
```

**Step 5: 驗證 server 啟動**

```bash
cd /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend/api
bun run dev &
sleep 2
curl http://localhost:3001/health
# Expected: {"status":"ok"}
pkill -f "bun run"
```

**Step 6: Commit**

```bash
git add api/
git commit -m "feat(api): initialize Elysia server with health endpoint"
```

---

## Task 2: 設定 Supabase 連線與環境變數

**Files:**
- Create: `api/.env.example`
- Create: `api/src/db.ts`
- Modify: `api/.gitignore`

**Step 1: 建立環境變數範本**

寫入 `api/.env.example`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
ADMIN_PASSWORD=your-admin-password
JWT_SECRET=your-jwt-secret
```

**Step 2: 建立 .env 檔案**

複製 `.env.example` 為 `.env` 並填入實際值（從現有的 `.env` 取得 Supabase 設定）:

```bash
cd /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend/api
cp .env.example .env
# 手動編輯 .env 填入實際值
```

**Step 3: 建立資料庫連線模組**

寫入 `api/src/db.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Step 4: 建立 api/.gitignore**

寫入 `api/.gitignore`:

```
node_modules/
.env
```

**Step 5: Commit**

```bash
git add api/.env.example api/src/db.ts api/.gitignore
git commit -m "feat(api): add Supabase connection and env config"
```

---

## Task 3: 建立資料庫 Schema (Supabase Migration)

**Files:**
- Create: `supabase/migrations/20260120000000_create_tables.sql`

**Step 1: 建立 migrations 目錄**

```bash
mkdir -p /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend/supabase/migrations
```

**Step 2: 寫入 migration 檔案**

寫入 `supabase/migrations/20260120000000_create_tables.sql`:

```sql
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
```

**Step 3: 在 Supabase Dashboard 執行 migration**

前往 Supabase Dashboard > SQL Editor，貼上並執行上述 SQL。

或使用 Supabase CLI:

```bash
cd /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend
npx supabase db push
```

**Step 4: Commit**

```bash
git add supabase/migrations/
git commit -m "feat(db): add players, items, game_results tables"
```

---

## Task 4: 實作公開 API - 物品列表

**Files:**
- Create: `api/src/routes/items.ts`
- Modify: `api/src/index.ts`

**Step 1: 建立 items route**

寫入 `api/src/routes/items.ts`:

```typescript
import { Elysia } from "elysia";
import { supabase } from "../db";

export const itemsRoutes = new Elysia({ prefix: "/api/items" })
  .get("/", async () => {
    const { data, error } = await supabase
      .from("items")
      .select("id, name, image_url")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return { items: data };
  });
```

**Step 2: 註冊 route 到主 app**

修改 `api/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { itemsRoutes } from "./routes/items";

const app = new Elysia()
  .use(cors())
  .use(itemsRoutes)
  .get("/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
```

**Step 3: 手動測試**

```bash
cd /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend/api
bun run dev &
sleep 2
curl http://localhost:3001/api/items
# Expected: {"items":[]}
pkill -f "bun run"
```

**Step 4: Commit**

```bash
git add api/src/routes/items.ts api/src/index.ts
git commit -m "feat(api): add GET /api/items endpoint"
```

---

## Task 5: 實作公開 API - 玩家自動補全

**Files:**
- Create: `api/src/routes/players.ts`
- Modify: `api/src/index.ts`

**Step 1: 建立 players route**

寫入 `api/src/routes/players.ts`:

```typescript
import { Elysia, t } from "elysia";
import { supabase } from "../db";

export const playersRoutes = new Elysia({ prefix: "/api/players" })
  .get(
    "/autocomplete",
    async ({ query }) => {
      const searchTerm = query.q || "";

      const { data, error } = await supabase
        .from("players")
        .select("id, name")
        .ilike("name", `%${searchTerm}%`)
        .limit(10);

      if (error) {
        throw new Error(error.message);
      }

      return { players: data };
    },
    {
      query: t.Object({
        q: t.Optional(t.String()),
      }),
    }
  );
```

**Step 2: 註冊 route**

修改 `api/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { itemsRoutes } from "./routes/items";
import { playersRoutes } from "./routes/players";

const app = new Elysia()
  .use(cors())
  .use(itemsRoutes)
  .use(playersRoutes)
  .get("/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
```

**Step 3: 手動測試**

```bash
cd /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend/api
bun run dev &
sleep 2
curl "http://localhost:3001/api/players/autocomplete?q=test"
# Expected: {"players":[]}
pkill -f "bun run"
```

**Step 4: Commit**

```bash
git add api/src/routes/players.ts api/src/index.ts
git commit -m "feat(api): add GET /api/players/autocomplete endpoint"
```

---

## Task 6: 實作公開 API - 提交遊戲結果

**Files:**
- Create: `api/src/routes/game-results.ts`
- Modify: `api/src/index.ts`

**Step 1: 建立 game-results route**

寫入 `api/src/routes/game-results.ts`:

```typescript
import { Elysia, t } from "elysia";
import { supabase } from "../db";

export const gameResultsRoutes = new Elysia({ prefix: "/api/game-results" })
  .post(
    "/",
    async ({ body }) => {
      const { data, error } = await supabase
        .from("game_results")
        .insert({
          player_name: body.player_name,
          avatar_seed: body.avatar_seed,
          selected_items: body.selected_items,
          guessed_gender: body.guessed_gender,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, id: data.id };
    },
    {
      body: t.Object({
        player_name: t.String(),
        avatar_seed: t.String(),
        selected_items: t.Array(t.String()),
        guessed_gender: t.Union([t.Literal("male"), t.Literal("female")]),
      }),
    }
  );
```

**Step 2: 註冊 route**

修改 `api/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { itemsRoutes } from "./routes/items";
import { playersRoutes } from "./routes/players";
import { gameResultsRoutes } from "./routes/game-results";

const app = new Elysia()
  .use(cors())
  .use(itemsRoutes)
  .use(playersRoutes)
  .use(gameResultsRoutes)
  .get("/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
```

**Step 3: 手動測試**

```bash
cd /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend/api
bun run dev &
sleep 2
curl -X POST http://localhost:3001/api/game-results \
  -H "Content-Type: application/json" \
  -d '{"player_name":"測試","avatar_seed":"test123","selected_items":[],"guessed_gender":"male"}'
# Expected: {"success":true,"id":"..."}
pkill -f "bun run"
```

**Step 4: Commit**

```bash
git add api/src/routes/game-results.ts api/src/index.ts
git commit -m "feat(api): add POST /api/game-results endpoint"
```

---

## Task 7: 實作管理員認證

**Files:**
- Create: `api/src/routes/admin/auth.ts`
- Create: `api/src/middleware/auth.ts`
- Modify: `api/src/index.ts`

**Step 1: 建立認證 middleware**

寫入 `api/src/middleware/auth.ts`:

```typescript
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const authPlugin = new Elysia({ name: "auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "fallback-secret-change-me",
      exp: "24h",
    })
  )
  .derive(async ({ jwt, headers, set }) => {
    const auth = headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return { isAdmin: false, adminPayload: null };
    }

    const token = auth.slice(7);
    const payload = await jwt.verify(token);

    if (!payload) {
      return { isAdmin: false, adminPayload: null };
    }

    return { isAdmin: true, adminPayload: payload };
  });

export const requireAdmin = (set: any, isAdmin: boolean) => {
  if (!isAdmin) {
    set.status = 401;
    return { error: "Unauthorized" };
  }
  return null;
};
```

**Step 2: 建立 admin auth route**

建立目錄並寫入 `api/src/routes/admin/auth.ts`:

```typescript
import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

export const adminAuthRoutes = new Elysia({ prefix: "/api/admin" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "fallback-secret-change-me",
      exp: "24h",
    })
  )
  .post(
    "/login",
    async ({ body, jwt, set }) => {
      if (body.password !== ADMIN_PASSWORD) {
        set.status = 401;
        return { error: "Invalid password" };
      }

      const token = await jwt.sign({ role: "admin" });
      return { token };
    },
    {
      body: t.Object({
        password: t.String(),
      }),
    }
  );
```

**Step 3: 註冊 route**

修改 `api/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { itemsRoutes } from "./routes/items";
import { playersRoutes } from "./routes/players";
import { gameResultsRoutes } from "./routes/game-results";
import { adminAuthRoutes } from "./routes/admin/auth";

const app = new Elysia()
  .use(cors())
  .use(itemsRoutes)
  .use(playersRoutes)
  .use(gameResultsRoutes)
  .use(adminAuthRoutes)
  .get("/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
```

**Step 4: 手動測試**

```bash
cd /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend/api
bun run dev &
sleep 2
# Test wrong password
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"wrong"}'
# Expected: {"error":"Invalid password"} with 401

# Test correct password (使用 .env 中設定的密碼)
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-admin-password"}'
# Expected: {"token":"..."}
pkill -f "bun run"
```

**Step 5: Commit**

```bash
mkdir -p api/src/routes/admin
git add api/src/middleware/auth.ts api/src/routes/admin/auth.ts api/src/index.ts
git commit -m "feat(api): add admin authentication with JWT"
```

---

## Task 8: 實作管理員 API - 玩家管理

**Files:**
- Create: `api/src/routes/admin/players.ts`
- Modify: `api/src/index.ts`

**Step 1: 建立 admin players route**

寫入 `api/src/routes/admin/players.ts`:

```typescript
import { Elysia, t } from "elysia";
import { supabase } from "../../db";
import { authPlugin, requireAdmin } from "../../middleware/auth";

export const adminPlayersRoutes = new Elysia({ prefix: "/api/admin/players" })
  .use(authPlugin)
  .get("/", async ({ set, isAdmin }) => {
    const unauthorized = requireAdmin(set, isAdmin);
    if (unauthorized) return unauthorized;

    const { data, error } = await supabase
      .from("players")
      .select("id, name, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return { players: data };
  })
  .post(
    "/",
    async ({ body, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const { data, error } = await supabase
        .from("players")
        .insert({ name: body.name })
        .select("id, name, created_at")
        .single();

      if (error) throw new Error(error.message);

      return { player: data };
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    }
  )
  .post(
    "/batch",
    async ({ body, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const players = body.names.map((name) => ({ name }));

      const { data, error } = await supabase
        .from("players")
        .insert(players)
        .select("id, name, created_at");

      if (error) throw new Error(error.message);

      return { players: data, count: data.length };
    },
    {
      body: t.Object({
        names: t.Array(t.String()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", params.id);

      if (error) throw new Error(error.message);

      return { success: true };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
```

**Step 2: 註冊 route**

修改 `api/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { itemsRoutes } from "./routes/items";
import { playersRoutes } from "./routes/players";
import { gameResultsRoutes } from "./routes/game-results";
import { adminAuthRoutes } from "./routes/admin/auth";
import { adminPlayersRoutes } from "./routes/admin/players";

const app = new Elysia()
  .use(cors())
  .use(itemsRoutes)
  .use(playersRoutes)
  .use(gameResultsRoutes)
  .use(adminAuthRoutes)
  .use(adminPlayersRoutes)
  .get("/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
```

**Step 3: Commit**

```bash
git add api/src/routes/admin/players.ts api/src/index.ts
git commit -m "feat(api): add admin players CRUD endpoints"
```

---

## Task 9: 實作管理員 API - 物品管理

**Files:**
- Create: `api/src/routes/admin/items.ts`
- Modify: `api/src/index.ts`

**Step 1: 建立 admin items route**

寫入 `api/src/routes/admin/items.ts`:

```typescript
import { Elysia, t } from "elysia";
import { supabase } from "../../db";
import { authPlugin, requireAdmin } from "../../middleware/auth";

export const adminItemsRoutes = new Elysia({ prefix: "/api/admin/items" })
  .use(authPlugin)
  .get("/", async ({ set, isAdmin }) => {
    const unauthorized = requireAdmin(set, isAdmin);
    if (unauthorized) return unauthorized;

    const { data, error } = await supabase
      .from("items")
      .select("id, name, image_url, created_at")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return { items: data };
  })
  .post(
    "/",
    async ({ body, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const { data, error } = await supabase
        .from("items")
        .insert({ name: body.name, image_url: body.image_url })
        .select("id, name, image_url, created_at")
        .single();

      if (error) throw new Error(error.message);

      return { item: data };
    },
    {
      body: t.Object({
        name: t.String(),
        image_url: t.String(),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const { data, error } = await supabase
        .from("items")
        .update({ name: body.name, image_url: body.image_url })
        .eq("id", params.id)
        .select("id, name, image_url, created_at")
        .single();

      if (error) throw new Error(error.message);

      return { item: data };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.String(),
        image_url: t.String(),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", params.id);

      if (error) throw new Error(error.message);

      return { success: true };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
```

**Step 2: 註冊 route**

修改 `api/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { itemsRoutes } from "./routes/items";
import { playersRoutes } from "./routes/players";
import { gameResultsRoutes } from "./routes/game-results";
import { adminAuthRoutes } from "./routes/admin/auth";
import { adminPlayersRoutes } from "./routes/admin/players";
import { adminItemsRoutes } from "./routes/admin/items";

const app = new Elysia()
  .use(cors())
  .use(itemsRoutes)
  .use(playersRoutes)
  .use(gameResultsRoutes)
  .use(adminAuthRoutes)
  .use(adminPlayersRoutes)
  .use(adminItemsRoutes)
  .get("/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
```

**Step 3: Commit**

```bash
git add api/src/routes/admin/items.ts api/src/index.ts
git commit -m "feat(api): add admin items CRUD endpoints"
```

---

## Task 10: 實作管理員 API - 結果與統計

**Files:**
- Create: `api/src/routes/admin/results.ts`
- Modify: `api/src/index.ts`

**Step 1: 建立 admin results route**

寫入 `api/src/routes/admin/results.ts`:

```typescript
import { Elysia } from "elysia";
import { supabase } from "../../db";
import { authPlugin, requireAdmin } from "../../middleware/auth";

export const adminResultsRoutes = new Elysia({ prefix: "/api/admin" })
  .use(authPlugin)
  .get("/results", async ({ set, isAdmin }) => {
    const unauthorized = requireAdmin(set, isAdmin);
    if (unauthorized) return unauthorized;

    // Get all game results
    const { data: results, error: resultsError } = await supabase
      .from("game_results")
      .select("*")
      .order("created_at", { ascending: false });

    if (resultsError) throw new Error(resultsError.message);

    // Get items to map IDs to names
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id, name");

    if (itemsError) throw new Error(itemsError.message);

    const itemMap = new Map(items.map((item) => [item.id, item.name]));

    // Enrich results with item names
    const enrichedResults = results.map((result) => ({
      ...result,
      selected_items: result.selected_items.map((itemId: string) => ({
        id: itemId,
        name: itemMap.get(itemId) || "Unknown",
      })),
    }));

    return { results: enrichedResults, total: results.length };
  })
  .get("/stats", async ({ set, isAdmin }) => {
    const unauthorized = requireAdmin(set, isAdmin);
    if (unauthorized) return unauthorized;

    // Get all game results
    const { data: results, error: resultsError } = await supabase
      .from("game_results")
      .select("selected_items, guessed_gender");

    if (resultsError) throw new Error(resultsError.message);

    // Get items for names
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id, name");

    if (itemsError) throw new Error(itemsError.message);

    // Calculate gender stats
    const genderStats = { male: 0, female: 0 };
    results.forEach((r) => {
      if (r.guessed_gender === "male") genderStats.male++;
      else if (r.guessed_gender === "female") genderStats.female++;
    });

    // Calculate item stats
    const itemCounts = new Map<string, number>();
    results.forEach((r) => {
      r.selected_items.forEach((itemId: string) => {
        itemCounts.set(itemId, (itemCounts.get(itemId) || 0) + 1);
      });
    });

    const itemStats = items.map((item) => ({
      item_id: item.id,
      name: item.name,
      count: itemCounts.get(item.id) || 0,
    }));

    // Sort by count descending
    itemStats.sort((a, b) => b.count - a.count);

    return {
      total_players: results.length,
      gender_stats: genderStats,
      item_stats: itemStats,
    };
  });
```

**Step 2: 註冊 route**

修改 `api/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { itemsRoutes } from "./routes/items";
import { playersRoutes } from "./routes/players";
import { gameResultsRoutes } from "./routes/game-results";
import { adminAuthRoutes } from "./routes/admin/auth";
import { adminPlayersRoutes } from "./routes/admin/players";
import { adminItemsRoutes } from "./routes/admin/items";
import { adminResultsRoutes } from "./routes/admin/results";

const app = new Elysia()
  .use(cors())
  .use(itemsRoutes)
  .use(playersRoutes)
  .use(gameResultsRoutes)
  .use(adminAuthRoutes)
  .use(adminPlayersRoutes)
  .use(adminItemsRoutes)
  .use(adminResultsRoutes)
  .get("/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`🦊 Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
```

**Step 3: Commit**

```bash
git add api/src/routes/admin/results.ts api/src/index.ts
git commit -m "feat(api): add admin results and stats endpoints"
```

---

## Task 11: 更新根目錄 gitignore 和文件

**Files:**
- Modify: `.gitignore`

**Step 1: 更新根目錄 .gitignore**

在根目錄 `.gitignore` 加入:

```
# API
api/.env
api/node_modules/
```

**Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: update gitignore for api directory"
```

---

## Task 12: 最終驗證

**Step 1: 啟動 server 並測試所有端點**

```bash
cd /Users/wuguanxing/Desktop/workspace/clubhouse-chat-game/.worktrees/api-backend/api
bun run dev &
sleep 2

# 1. Health check
curl http://localhost:3001/health

# 2. Public APIs
curl http://localhost:3001/api/items
curl "http://localhost:3001/api/players/autocomplete?q=test"

# 3. Admin login
TOKEN=$(curl -s -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"YOUR_ADMIN_PASSWORD"}' | jq -r '.token')

echo "Token: $TOKEN"

# 4. Admin APIs with token
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/admin/players
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/admin/items
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/admin/results
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/admin/stats

pkill -f "bun run"
```

**Step 2: 確認所有 commits**

```bash
git log --oneline -10
```

---

## Summary

| Task | Description | Commits |
|------|-------------|---------|
| 1 | 初始化 Elysia 專案 | 1 |
| 2 | Supabase 連線設定 | 1 |
| 3 | 資料庫 Schema | 1 |
| 4 | GET /api/items | 1 |
| 5 | GET /api/players/autocomplete | 1 |
| 6 | POST /api/game-results | 1 |
| 7 | Admin 認證 (JWT) | 1 |
| 8 | Admin 玩家 CRUD | 1 |
| 9 | Admin 物品 CRUD | 1 |
| 10 | Admin 結果與統計 | 1 |
| 11 | 更新 gitignore | 1 |
| 12 | 最終驗證 | 0 |

**Total: 11 commits**
