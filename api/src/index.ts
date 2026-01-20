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
