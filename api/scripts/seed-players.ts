import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const mockPlayers = [
  { name: "小明", avatar_seed: "xiaoming_001" },
  { name: "小華", avatar_seed: "xiaohua_002" },
  { name: "小美", avatar_seed: "xiaomei_003" },
  { name: "小強", avatar_seed: "xiaoqiang_004" },
  { name: "小玲", avatar_seed: "xiaoling_005" },
  { name: "阿傑", avatar_seed: "ajie_006" },
  { name: "雅婷", avatar_seed: "yating_007" },
  { name: "志偉", avatar_seed: "zhiwei_008" },
  { name: "怡君", avatar_seed: "yijun_009" },
  { name: "家豪", avatar_seed: "jiahao_010" },
];

async function seedPlayers() {
  console.log("Seeding players...");

  const { data, error } = await supabase
    .from("players")
    .insert(mockPlayers)
    .select("id, name, avatar_seed");

  if (error) {
    console.error("Error seeding players:", error.message);
    process.exit(1);
  }

  console.log(`Successfully inserted ${data.length} players:`);
  data.forEach((player) => {
    console.log(`  - ${player.name} (${player.avatar_seed})`);
  });
}

seedPlayers();
