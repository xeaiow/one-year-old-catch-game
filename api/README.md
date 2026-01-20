# API Backend

抓周遊戲後端 API，使用 Elysia + Bun 建置。

## 環境設定

### 1. 安裝依賴

```bash
cd api
bun install
```

### 2. 設定環境變數

複製範本並填入實際值：

```bash
cp .env.example .env
```

編輯 `.env`：

```env
SUPABASE_URL=https://ycfvivsjgaodxjdeatmx.supabase.co
SUPABASE_SERVICE_KEY=<your-service-role-key>
ADMIN_PASSWORD=<your-admin-password>
JWT_SECRET=<your-jwt-secret>
```

**取得 Service Role Key：**
1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇專案 → Settings → API
3. 複製 `service_role` key（注意：不是 `anon` key）

### 3. 執行資料庫 Migration

在 Supabase Dashboard 執行 SQL：

1. 前往 SQL Editor
2. 貼上 `supabase/migrations/20260120000000_create_tables.sql` 的內容
3. 執行

## 啟動服務

**開發模式（自動重載）：**

```bash
bun run dev
```

**生產模式：**

```bash
bun run start
```

服務啟動於 `http://localhost:3001`

## API 端點

### 公開 API

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/health` | 健康檢查 |
| GET | `/api/items` | 取得所有物品 |
| GET | `/api/players/autocomplete?q=xxx` | 玩家名稱自動補全 |
| POST | `/api/game-results` | 提交遊戲結果 |

### 管理員 API

需先登入取得 token，請求時帶上 `Authorization: Bearer <token>`

| Method | Endpoint | 說明 |
|--------|----------|------|
| POST | `/api/admin/login` | 管理員登入 |
| GET | `/api/admin/players` | 取得玩家名單 |
| POST | `/api/admin/players` | 新增玩家 |
| POST | `/api/admin/players/batch` | 批次新增玩家 |
| DELETE | `/api/admin/players/:id` | 刪除玩家 |
| GET | `/api/admin/items` | 取得物品列表 |
| POST | `/api/admin/items` | 新增物品 |
| PUT | `/api/admin/items/:id` | 修改物品 |
| DELETE | `/api/admin/items/:id` | 刪除物品 |
| GET | `/api/admin/results` | 取得遊戲結果 |
| GET | `/api/admin/stats` | 取得統計數據 |

## 測試 API

```bash
# Health check
curl http://localhost:3001/health

# 取得物品列表
curl http://localhost:3001/api/items

# 管理員登入
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-admin-password"}'

# 使用 token 存取管理員 API
curl -H "Authorization: Bearer <token>" \
  http://localhost:3001/api/admin/stats
```
