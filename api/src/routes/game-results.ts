import { Elysia, t } from "elysia";
import { supabase } from "../db";

export const gameResultsRoutes = new Elysia({ prefix: "/api/game-results" })
  .get(
    "/check",
    async ({ query }) => {
      const { data: existing } = await supabase
        .from("game_results")
        .select("id")
        .eq("player_name", query.name)
        .single();

      return { exists: !!existing };
    },
    {
      query: t.Object({
        name: t.String(),
      }),
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      // Check if player_name already exists
      const { data: existing } = await supabase
        .from("game_results")
        .select("id")
        .eq("player_name", body.player_name)
        .single();

      if (existing) {
        set.status = 409;
        return { error: "Player has already submitted" };
      }

      const { data, error } = await supabase
        .from("game_results")
        .insert({
          player_name: body.player_name,
          avatar_seed: body.avatar_seed,
          selected_items: body.selected_items,
          guessed_gender: body.guessed_gender,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, id: data.id };
    },
    {
      body: t.Object({
        player_name: t.String(),
        avatar_seed: t.String(),
        selected_items: t.Array(t.String()),
        guessed_gender: t.Union([t.Literal("male"), t.Literal("female")]),
      }),
    }
  );
