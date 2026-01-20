import { Elysia, t } from "elysia";
import { supabase } from "../../db";
import { authPlugin, requireAdmin } from "../../middleware/auth";

export const adminPlayersRoutes = new Elysia({ prefix: "/api/admin/players" })
  .use(authPlugin)
  .get("/", async ({ set, isAdmin }) => {
    const unauthorized = requireAdmin(set, isAdmin);
    if (unauthorized) return unauthorized;

    const { data, error } = await supabase
      .from("players")
      .select("id, name, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return { players: data };
  })
  .post(
    "/",
    async ({ body, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const { data, error } = await supabase
        .from("players")
        .insert({ name: body.name })
        .select("id, name, created_at")
        .single();

      if (error) throw new Error(error.message);

      return { player: data };
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    }
  )
  .post(
    "/batch",
    async ({ body, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const players = body.names.map((name) => ({ name }));

      const { data, error } = await supabase
        .from("players")
        .insert(players)
        .select("id, name, created_at");

      if (error) throw new Error(error.message);

      return { players: data, count: data.length };
    },
    {
      body: t.Object({
        names: t.Array(t.String()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", params.id);

      if (error) throw new Error(error.message);

      return { success: true };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
