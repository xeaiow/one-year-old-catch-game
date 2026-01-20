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
