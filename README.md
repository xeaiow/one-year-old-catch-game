# 抓周派對互動遊戲 🎉

一個專為小寶一歲生日抓周儀式打造的多人互動網頁遊戲。親友們透過自己的手機加入，一起猜寶寶會抓到哪些物品，並在大螢幕上同步揭曉結果。

## 功能特色

- 🎯 **猜猜看**：每位參加者選擇 N 個物品，預測小寶會抓哪些
- 🎊 **結果揭曉**：主持人輸入抓周實際結果，大螢幕同步揭曉贏家
- 🎮 **Bingo 模式**：以 Bingo 形式呈現選擇與結果
- 👶 **角色選擇**：每位玩家挑選可愛的角色頭像
- 📺 **Classroom 大螢幕視圖**：適合投影在活動現場
- 🔁 **參加者自動補全**：名單即時搜尋、防止重複參加
- 🛠️ **管理員後台**：管理玩家、物品、檢視結果與統計

## 技術架構

### 前端 (`/`)
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn-ui (Radix UI)
- framer-motion / motion 動畫
- React Router、TanStack Query
- canvas-confetti 慶祝特效

### 後端 (`/api`)
- Bun + Elysia
- Supabase (PostgreSQL) 資料儲存
- JWT 管理員認證

## 頁面結構

| 路徑 | 頁面 | 說明 |
|------|------|------|
| `/` | Index | 輸入名字加入遊戲 |
| `/character` | CharacterSelect | 選擇角色頭像 |
| `/guess` | Guess | 猜測小寶會抓的物品 |
| `/guess-success` | GuessSuccess | 送出成功 |
| `/reveal` | Reveal | 揭曉實際抓周結果 |
| `/bingo` | Bingo | Bingo 呈現模式 |
| `/classroom` | Classroom | 大螢幕觀看視圖 |
| `/catch` | OneYearOldCatch | 抓周物品展示 |

## 快速開始

### 前置需求
- Node.js & pnpm
- Bun
- Supabase 專案

### 前端

```bash
pnpm install
pnpm dev
```

建立 `.env` 檔案：

```env
VITE_API_URL=http://localhost:3001
```

### 後端

詳細後端文件請見 [`api/README.md`](./api/README.md)。

```bash
cd api
bun install
cp .env.example .env   # 填入 Supabase 與管理員設定
bun run dev
```

### 資料庫 Migration

於 Supabase Dashboard 的 SQL Editor 執行 `supabase/migrations/` 目錄下的 SQL。

## 專案結構

```
.
├── src/                  # 前端應用
│   ├── pages/            # 路由頁面
│   ├── components/       # UI、bingo、guess、reveal 子元件
│   ├── integrations/     # Supabase client
│   ├── hooks/ lib/       # 自訂 hooks 與 API helpers
├── api/                  # Bun + Elysia 後端
│   └── src/routes/       # 公開與管理員端點
├── supabase/migrations/  # 資料庫 schema
└── public/               # 物品圖片等靜態資源
```
