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
