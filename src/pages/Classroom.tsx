import { useState, useEffect } from "react";

interface Student {
  id: number;
  name: string;
  avatarSeed: string;
  islandIndex: number;
}

// Pre-defined island positions - 60+ unique spots to avoid overlapping
// Spread across all visible islands with proper spacing
const islandPositions = [
  // Top-left large island (heart-shaped) - 6 spots
  { x: 9, y: 8 }, { x: 14, y: 9 }, { x: 17, y: 12 }, { x: 12, y: 14 }, { x: 8, y: 12 }, { x: 15, y: 16 },
  // Top-center island with palm trees - 4 spots
  { x: 36, y: 6 }, { x: 41, y: 8 }, { x: 44, y: 11 }, { x: 38, y: 12 },
  // Top center-right elongated island - 5 spots
  { x: 53, y: 11 }, { x: 58, y: 13 }, { x: 62, y: 15 }, { x: 66, y: 17 }, { x: 56, y: 17 },
  // Top-right volcano island - 5 spots
  { x: 84, y: 6 }, { x: 89, y: 8 }, { x: 92, y: 12 }, { x: 87, y: 14 }, { x: 90, y: 16 },
  // Left large island with huts - 5 spots
  { x: 5, y: 28 }, { x: 10, y: 30 }, { x: 7, y: 34 }, { x: 12, y: 36 }, { x: 4, y: 32 },
  // Center-left small palm island - 3 spots
  { x: 24, y: 25 }, { x: 29, y: 27 }, { x: 32, y: 30 },
  // Center large island with dock - 7 spots
  { x: 33, y: 36 }, { x: 38, y: 38 }, { x: 43, y: 40 }, { x: 36, y: 42 }, { x: 41, y: 44 }, { x: 46, y: 42 }, { x: 35, y: 40 },
  // Center-right island with volcano - 4 spots
  { x: 58, y: 28 }, { x: 63, y: 31 }, { x: 66, y: 34 }, { x: 60, y: 35 },
  // Right side elongated island - 5 spots
  { x: 76, y: 34 }, { x: 81, y: 36 }, { x: 85, y: 39 }, { x: 79, y: 41 }, { x: 83, y: 43 },
  // Left triangle island with dock - 4 spots
  { x: 8, y: 50 }, { x: 13, y: 53 }, { x: 10, y: 57 }, { x: 15, y: 59 },
  // Center-left small island - 3 spots
  { x: 28, y: 49 }, { x: 33, y: 52 }, { x: 30, y: 56 },
  // Center island with palms - 4 spots
  { x: 44, y: 52 }, { x: 49, y: 55 }, { x: 52, y: 58 }, { x: 46, y: 60 },
  // Center-right island with hut - 4 spots
  { x: 64, y: 50 }, { x: 69, y: 53 }, { x: 72, y: 56 }, { x: 66, y: 58 },
  // Right side island - 4 spots
  { x: 81, y: 54 }, { x: 86, y: 57 }, { x: 89, y: 60 }, { x: 83, y: 62 },
  // Bottom-left small island - 3 spots
  { x: 5, y: 70 }, { x: 10, y: 73 }, { x: 7, y: 77 },
  // Bottom left-center island with dock - 4 spots
  { x: 20, y: 74 }, { x: 25, y: 77 }, { x: 28, y: 80 }, { x: 22, y: 82 },
  // Bottom center large island - 6 spots
  { x: 48, y: 78 }, { x: 53, y: 80 }, { x: 58, y: 83 }, { x: 51, y: 86 }, { x: 56, y: 88 }, { x: 46, y: 84 },
  // Bottom right island - 4 spots
  { x: 74, y: 76 }, { x: 79, y: 79 }, { x: 82, y: 82 }, { x: 76, y: 84 },
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

const simulatedStudents = chineseNames.map((name) => ({
  name,
  seed: `${name}_${generateRandomString(6)}`,
}));

const Classroom = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Shuffle positions and assign each student to a unique position
    const shuffledPositions = [...Array(islandPositions.length).keys()]
      .sort(() => Math.random() - 0.5);
    
    const assignedStudents = simulatedStudents.map((student, index) => ({
      id: index,
      name: student.name,
      avatarSeed: student.seed,
      islandIndex: shuffledPositions[index], // Each student gets unique position
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-xl">
              <img
                src={`https://tapback.co/api/avatar/${student.avatarSeed}.webp`}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-0.5 px-1.5 py-0.5 bg-white/95 rounded-full shadow-lg">
              <span className="text-[8px] sm:text-[10px] font-medium text-foreground whitespace-nowrap">{student.name}</span>
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
