# API 設計文件

## 概述

為抓周遊戲設計後端 API，使用 **Elysia + Bun** 技術棧。

### 目標

1. **紀錄遊戲結果** - 儲存每位玩家的選擇（名字、頭像、選的物品、猜的性別）
2. **統計分析** - 管理員可查看所有結果和統計數據

### 設計決策

- 物品後台可配置（名稱、圖片）
- 簡單密碼保護管理員後台
- 單次活動，不需區分場次
- 玩家名單預先設定，支援自動補全

---

## 資料模型

### players（預設玩家名單）

| 欄位       | 類型   | 說明       |
| ---------- | ------ | ---------- |
| id         | UUID   | 主鍵       |
| name       | TEXT   | 玩家名字   |
| created_at | TIME   | 建立時間   |

### items（抓周物品）

| 欄位       | 類型   | 說明       |
| ---------- | ------ | ---------- |
| id         | UUID   | 主鍵       |
| name       | TEXT   | 物品名稱   |
| image_url  | TEXT   | 圖片網址   |
| created_at | TIME   | 建立時間   |

### game_results（遊戲結果）

| 欄位           | 類型    | 說明           |
| -------------- | ------- | -------------- |
| id             | UUID    | 主鍵           |
| player_name    | TEXT    | 玩家名字       |
| avatar_seed    | TEXT    | 頭像種子       |
| selected_items | UUID[]  | 選的 3 個物品  |
| guessed_gender | TEXT    | 猜的性別       |
| created_at     | TIME    | 完成時間       |

---

## API 端點

### 公開 API（前端遊戲使用）

#### `GET /api/players/autocomplete`

根據輸入搜尋匹配的玩家名字。

**Query Parameters:**
- `q` - 搜尋關鍵字

**Response:**
```json
{
  "players": [
    { "id": "uuid", "name": "玩家名字" }
  ]
}
```

#### `GET /api/items`

取得所有抓周物品列表。

**Response:**
```json
{
  "items": [
    { "id": "uuid", "name": "物品名稱", "image_url": "/1.avif" }
  ]
}
```

#### `POST /api/game-results`

提交遊戲結果。

**Request:**
```json
{
  "player_name": "玩家名字",
  "avatar_seed": "seed-string",
  "selected_items": ["uuid1", "uuid2", "uuid3"],
  "guessed_gender": "male" | "female"
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid"
}
```

---

### 管理員 API（需密碼驗證）

所有管理員 API 需在 Header 帶上 `Authorization: Bearer <token>`。

#### `POST /api/admin/login`

驗證管理員密碼。

**Request:**
```json
{
  "password": "admin-password"
}
```

**Response:**
```json
{
  "token": "jwt-token"
}
```

**Error:** `401 Unauthorized`

---

### 玩家名單管理

#### `GET /api/admin/players`

取得所有預設玩家名單。

**Response:**
```json
{
  "players": [
    { "id": "uuid", "name": "玩家名字", "created_at": "timestamp" }
  ]
}
```

#### `POST /api/admin/players`

新增單一玩家。

**Request:**
```json
{
  "name": "玩家名字"
}
```

#### `POST /api/admin/players/batch`

批次新增玩家。

**Request:**
```json
{
  "names": ["名字1", "名字2", "名字3"]
}
```

#### `DELETE /api/admin/players/:id`

刪除玩家。

---

### 物品管理

#### `GET /api/admin/items`

取得所有物品（同公開 API，但可能包含更多資訊）。

#### `POST /api/admin/items`

新增物品。

**Request:**
```json
{
  "name": "物品名稱",
  "image_url": "/image.avif"
}
```

#### `PUT /api/admin/items/:id`

修改物品。

**Request:**
```json
{
  "name": "新名稱",
  "image_url": "/new-image.avif"
}
```

#### `DELETE /api/admin/items/:id`

刪除物品。

---

### 結果與統計

#### `GET /api/admin/results`

取得所有遊戲結果。

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "player_name": "玩家名字",
      "avatar_seed": "seed",
      "selected_items": [
        { "id": "uuid", "name": "物品名稱" }
      ],
      "guessed_gender": "male",
      "created_at": "timestamp"
    }
  ],
  "total": 50
}
```

#### `GET /api/admin/stats`

取得統計數據。

**Response:**
```json
{
  "total_players": 50,
  "gender_stats": {
    "male": 28,
    "female": 22
  },
  "item_stats": [
    { "item_id": "uuid", "name": "算盤", "count": 15 },
    { "item_id": "uuid", "name": "書本", "count": 12 }
  ]
}
```

---

## 技術細節

### 技術棧

- **Runtime:** Bun
- **Framework:** Elysia
- **Database:** Supabase (PostgreSQL)

### 認證機制

- 管理員使用單一密碼登入
- 密碼存於環境變數 `ADMIN_PASSWORD`
- 登入成功後發放 JWT token
- Token 有效期限建議 24 小時

### 環境變數

```env
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=your-secret-password
JWT_SECRET=your-jwt-secret
```
