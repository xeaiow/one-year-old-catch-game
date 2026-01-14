import { useState, useEffect } from "react";

interface Student {
  id: number;
  name: string;
  avatarSeed: string;
  islandIndex: number;
}

// Pre-defined island positions with multiple spots per island
// Each island can hold multiple students clustered together
const islandPositions = [
  // Top-left large island (heart-shaped) - 4 spots
  { x: 11, y: 10 }, { x: 15, y: 12 }, { x: 13, y: 15 }, { x: 10, y: 13 },
  // Top-center island with palm trees - 3 spots
  { x: 38, y: 7 }, { x: 42, y: 9 }, { x: 40, y: 11 },
  // Top center-right elongated island - 4 spots
  { x: 55, y: 12 }, { x: 59, y: 14 }, { x: 63, y: 16 }, { x: 57, y: 16 },
  // Top-right volcano island - 3 spots
  { x: 85, y: 8 }, { x: 89, y: 11 }, { x: 87, y: 14 },
  // Left large island with huts - 4 spots
  { x: 6, y: 30 }, { x: 10, y: 32 }, { x: 8, y: 35 }, { x: 12, y: 34 },
  // Center-left small palm island - 2 spots
  { x: 26, y: 27 }, { x: 30, y: 29 },
  // Center large island with dock - 5 spots
  { x: 35, y: 38 }, { x: 40, y: 40 }, { x: 38, y: 43 }, { x: 43, y: 42 }, { x: 36, y: 41 },
  // Center-right island with volcano - 3 spots
  { x: 60, y: 30 }, { x: 64, y: 33 }, { x: 62, y: 36 },
  // Right side elongated island - 4 spots
  { x: 78, y: 36 }, { x: 82, y: 38 }, { x: 80, y: 41 }, { x: 84, y: 40 },
  // Left triangle island with dock - 3 spots
  { x: 10, y: 52 }, { x: 14, y: 55 }, { x: 12, y: 58 },
  // Center-left small island - 2 spots
  { x: 30, y: 51 }, { x: 34, y: 54 },
  // Center island with palms - 3 spots
  { x: 46, y: 54 }, { x: 50, y: 57 }, { x: 48, y: 60 },
  // Center-right island with hut - 3 spots
  { x: 66, y: 52 }, { x: 70, y: 55 }, { x: 68, y: 58 },
  // Right side island - 3 spots
  { x: 83, y: 56 }, { x: 87, y: 59 }, { x: 85, y: 62 },
  // Bottom-left small island - 2 spots
  { x: 6, y: 72 }, { x: 10, y: 75 },
  // Bottom left-center island with dock - 3 spots
  { x: 22, y: 76 }, { x: 26, y: 79 }, { x: 24, y: 82 },
  // Bottom center large island - 4 spots
  { x: 50, y: 80 }, { x: 54, y: 83 }, { x: 52, y: 86 }, { x: 56, y: 85 },
  // Bottom right island - 3 spots
  { x: 76, y: 78 }, { x: 80, y: 81 }, { x: 78, y: 84 },
];

// Chinese names for 50 simulated students
const chineseNames = [
  "小明", "小華", "阿強", "小美", "大衛", "小芳", "志明", "春嬌", "阿傑", "小琳",
  "建國", "美玲", "俊宏", "雅婷", "家豪", "怡君", "冠宇", "佩珊", "柏翰", "欣怡",
  "承恩", "雨涵", "宇軒", "思妤", "博文", "詩涵", "浩然", "語彤", "睿哲", "心怡",
  "子豪", "雅琪", "彥廷", "佳穎", "宗翰", "宜蓁", "品睿", "芷晴", "奕辰", "詩婷",
  "昱翔", "筱涵", "瀚文", "羽彤", "鈺翔", "晨曦", "皓軒", "紫涵", "宸安", "若彤"
];

// Generate 50 simulated students
const generateRandomString = (length: number) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const simulatedStudents = chineseNames.map((name, index) => ({
  name,
  seed: `${name}_${generateRandomString(6)}`,
}));

const Classroom = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Assign each student to a position (allow multiple students per island area)
    const assignedStudents = simulatedStudents.map((student, index) => ({
      id: index,
      name: student.name,
      avatarSeed: student.seed,
      islandIndex: index % islandPositions.length,
    }));
    
    setStudents(assignedStudents);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <img
        src="/islands-bg.png"
        alt="Island background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/40 to-transparent">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white drop-shadow-lg">🏝️ 島嶼教室</h1>
          <p className="text-white/90 text-sm mt-1 drop-shadow">今日出席人數：{students.length} 人</p>
        </div>
      </div>

      {/* Avatars positioned on specific islands */}
      {students.map((student) => {
        const position = islandPositions[student.islandIndex];
        return (
          <div
            key={student.id}
            className="absolute flex flex-col items-center transition-all duration-300 hover:scale-110 hover:z-10 cursor-pointer z-[5]"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-xl">
              <img
                src={`https://tapback.co/api/avatar/${student.avatarSeed}.webp`}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-1 px-2 py-0.5 bg-white/95 rounded-full shadow-lg">
              <span className="text-[10px] sm:text-xs font-medium text-foreground whitespace-nowrap">{student.name}</span>
            </div>
          </div>
        );
      })}

      {/* Legend at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/40 to-transparent">
        <div className="flex justify-center gap-4 text-sm text-white">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border border-white/50"></div>
            <span className="drop-shadow-lg">已入座</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/70 drop-shadow">🏝️ {islandPositions.length - students.length} 個空島</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
