import { Elysia } from "elysia";
import { supabase } from "../../db";
import { authPlugin, requireAdmin } from "../../middleware/auth";

export const adminResultsRoutes = new Elysia({ prefix: "/api/admin" })
  .use(authPlugin)
  .get("/results", async ({ set, isAdmin }) => {
    const unauthorized = requireAdmin(set, isAdmin);
    if (unauthorized) return unauthorized;

    // Get all game results
    const { data: results, error: resultsError } = await supabase
      .from("game_results")
      .select("*")
      .order("created_at", { ascending: false });

    if (resultsError) throw new Error(resultsError.message);

    // Get items to map IDs to names
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id, name");

    if (itemsError) throw new Error(itemsError.message);

    const itemMap = new Map(items.map((item) => [item.id, item.name]));

    // Enrich results with item names
    const enrichedResults = results.map((result) => ({
      ...result,
      selected_items: result.selected_items.map((itemId: string) => ({
        id: itemId,
        name: itemMap.get(itemId) || "Unknown",
      })),
    }));

    return { results: enrichedResults, total: results.length };
  })
  .get("/stats", async ({ set, isAdmin }) => {
    const unauthorized = requireAdmin(set, isAdmin);
    if (unauthorized) return unauthorized;

    // Get all game results
    const { data: results, error: resultsError } = await supabase
      .from("game_results")
      .select("selected_items, guessed_gender");

    if (resultsError) throw new Error(resultsError.message);

    // Get items for names
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id, name");

    if (itemsError) throw new Error(itemsError.message);

    // Calculate gender stats
    const genderStats = { male: 0, female: 0 };
    results.forEach((r) => {
      if (r.guessed_gender === "male") genderStats.male++;
      else if (r.guessed_gender === "female") genderStats.female++;
    });

    // Calculate item stats
    const itemCounts = new Map<string, number>();
    results.forEach((r) => {
      r.selected_items.forEach((itemId: string) => {
        itemCounts.set(itemId, (itemCounts.get(itemId) || 0) + 1);
      });
    });

    const itemStats = items.map((item) => ({
      item_id: item.id,
      name: item.name,
      count: itemCounts.get(item.id) || 0,
    }));

    // Sort by count descending
    itemStats.sort((a, b) => b.count - a.count);

    return {
      total_players: results.length,
      gender_stats: genderStats,
      item_stats: itemStats,
    };
  });
