import { supabase } from "../src/db";

const chineseNames = [
  "王小明", "李美玲", "張志偉", "陳淑芬", "林俊傑",
  "黃雅婷", "劉建宏", "吳佳穎", "楊宗翰", "周怡君",
  "許家豪", "鄭雅文", "謝宜芳", "郭俊宏", "何佳蓉",
  "蔡明軒", "潘怡婷", "邱志豪", "蕭雅琪", "葉建成",
  "呂淑惠", "蘇俊賢", "盧怡伶", "江宏偉", "徐雅萍",
  "高志明", "曾美君", "賴建志", "洪雅芳", "方俊豪",
];

function generateRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function seedFakeResults() {
  // Fetch existing items
  const { data: items, error: itemsError } = await supabase
    .from("items")
    .select("id");

  if (itemsError) {
    console.error("Failed to fetch items:", itemsError);
    return;
  }

  if (!items || items.length === 0) {
    console.error("No items found in database. Please add items first.");
    return;
  }

  const itemIds = items.map((item) => item.id);
  console.log(`Found ${itemIds.length} items in database`);

  // Generate 30 fake results
  const fakeResults = chineseNames.map((name) => ({
    player_name: name,
    avatar_seed: generateRandomString(12),
    selected_items: getRandomItems(itemIds, 3), // Each player selects 3 items
    guessed_gender: Math.random() > 0.5 ? "male" : "female",
  }));

  // Insert into database
  const { data, error } = await supabase
    .from("game_results")
    .insert(fakeResults)
    .select("id, player_name");

  if (error) {
    console.error("Failed to insert fake results:", error);
    return;
  }

  console.log(`Successfully inserted ${data.length} fake game results:`);
  data.forEach((result) => {
    console.log(`  - ${result.player_name} (${result.id})`);
  });
}

seedFakeResults();
