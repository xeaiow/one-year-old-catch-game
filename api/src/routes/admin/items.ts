import { Elysia, t } from "elysia";
import { supabase } from "../../db";
import { authPlugin, requireAdmin } from "../../middleware/auth";

export const adminItemsRoutes = new Elysia({ prefix: "/api/admin/items" })
  .use(authPlugin)
  .get("/", async ({ set, isAdmin }) => {
    const unauthorized = requireAdmin(set, isAdmin);
    if (unauthorized) return unauthorized;

    const { data, error } = await supabase
      .from("items")
      .select("id, name, image_url, created_at")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return { items: data };
  })
  .post(
    "/",
    async ({ body, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const { data, error } = await supabase
        .from("items")
        .insert({ name: body.name, image_url: body.image_url })
        .select("id, name, image_url, created_at")
        .single();

      if (error) throw new Error(error.message);

      return { item: data };
    },
    {
      body: t.Object({
        name: t.String(),
        image_url: t.String(),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const { data, error } = await supabase
        .from("items")
        .update({ name: body.name, image_url: body.image_url })
        .eq("id", params.id)
        .select("id, name, image_url, created_at")
        .single();

      if (error) throw new Error(error.message);

      return { item: data };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.String(),
        image_url: t.String(),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, set, isAdmin }) => {
      const unauthorized = requireAdmin(set, isAdmin);
      if (unauthorized) return unauthorized;

      const { error } = await supabase
        .from("items")
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
