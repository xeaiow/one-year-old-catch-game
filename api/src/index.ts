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
