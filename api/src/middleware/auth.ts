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
