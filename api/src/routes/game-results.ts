import { Elysia, t } from "elysia";
import { supabase } from "../db";

export const gameResultsRoutes = new Elysia({ prefix: "/api/game-results" })
  .post(
    "/",
    async ({ body }) => {
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
