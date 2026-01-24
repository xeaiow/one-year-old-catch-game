import { Elysia, t } from "elysia";
import { supabase } from "../db";

interface MatchedPlayer {
  id: string;
  player_name: string;
  avatar_seed: string;
  selected_items: string[];
  guessed_gender: string;
  match_count: number;
}

export const gameResultsRoutes = new Elysia({ prefix: "/api/game-results" })
  .get("/", async () => {
    const { data: results, error } = await supabase
      .from("game_results")
      .select("id, player_name, avatar_seed")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return { players: results || [] };
  })
  .get(
    "/matches",
    async ({ query }) => {
      const targetItems = query.items.split(",").filter(Boolean);

      if (targetItems.length !== 3) {
        return { error: "Must provide exactly 3 item IDs" };
      }

      const { data: results, error } = await supabase
        .from("game_results")
        .select("id, player_name, avatar_seed, selected_items, guessed_gender");

      if (error) {
        throw new Error(error.message);
      }

      const grouped: Record<number, MatchedPlayer[]> = { 3: [], 2: [], 1: [], 0: [] };

      for (const result of results || []) {
        const playerItems = result.selected_items as string[];
        const matchCount = playerItems.filter((item) => targetItems.includes(item)).length;
        grouped[matchCount].push({
          ...result,
          match_count: matchCount,
        });
      }

      return {
        match3: grouped[3],
        match2: grouped[2],
        match1: grouped[1],
        match0: grouped[0],
        total: results?.length || 0,
      };
    },
    {
      query: t.Object({
        items: t.String(),
      }),
    }
  )
  .get(
    "/gender-matches",
    async ({ query }) => {
      const targetGender = query.gender;

      const { data: results, error } = await supabase
        .from("game_results")
        .select("id, player_name, avatar_seed, selected_items, guessed_gender");

      if (error) {
        throw new Error(error.message);
      }

      const correct: MatchedPlayer[] = [];
      const incorrect: MatchedPlayer[] = [];

      for (const result of results || []) {
        const player: MatchedPlayer = {
          ...result,
          match_count: result.guessed_gender === targetGender ? 1 : 0,
        };

        if (result.guessed_gender === targetGender) {
          correct.push(player);
        } else {
          incorrect.push(player);
        }
      }

      return {
        correct,
        incorrect,
        total: results?.length || 0,
      };
    },
    {
      query: t.Object({
        gender: t.Union([t.Literal("male"), t.Literal("female")]),
      }),
    }
  )
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
  .get("/random", async () => {
    const { data: results, error } = await supabase
      .from("game_results")
      .select("id, player_name, avatar_seed");

    if (error) {
      throw new Error(error.message);
    }

    if (!results || results.length === 0) {
      return { player: null };
    }

    const randomIndex = Math.floor(Math.random() * results.length);
    return { player: results[randomIndex] };
  })
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
