import { Elysia } from "elysia";
import { supabase } from "../db";

export const itemsRoutes = new Elysia({ prefix: "/api/items" })
  .get("/", async () => {
    const { data, error } = await supabase
      .from("items")
      .select("id, name, image_url")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return { items: data };
  });
