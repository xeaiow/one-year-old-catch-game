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
