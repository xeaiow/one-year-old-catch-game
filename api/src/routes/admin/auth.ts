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
