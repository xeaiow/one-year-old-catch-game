import { useState, useEffect } from "react";

interface Student {
  id: number;
  name: string;
  avatarSeed: string;
  islandIndex: number;
}

// Pre-defined island positions (percentage-based for responsiveness)
// Precisely mapped to the actual island centers in the background image
const islandPositions = [
  { x: 13, y: 12 },  // Top-left large island (heart-shaped)
  { x: 40, y: 8 },   // Top-center island with palm trees
  { x: 58, y: 14 },  // Top center-right elongated island
  { x: 87, y: 10 },  // Top-right volcano island
  { x: 8, y: 32 },   // Left large island with huts
  { x: 28, y: 28 },  // Center-left small palm island
  { x: 38, y: 40 },  // Center large island with dock
  { x: 62, y: 32 },  // Center-right island with volcano
  { x: 80, y: 38 },  // Right side elongated island
  { x: 12, y: 54 },  // Left triangle island with dock
  { x: 32, y: 52 },  // Center-left small island
  { x: 48, y: 56 },  // Center island with palms
  { x: 68, y: 54 },  // Center-right island with hut
  { x: 85, y: 58 },  // Right side island
  { x: 8, y: 74 },   // Bottom-left small island
  { x: 24, y: 78 },  // Bottom left-center island with dock
  { x: 52, y: 82 },  // Bottom center large island
  { x: 78, y: 80 },  // Bottom right island
];

// Simulated students with random names
const simulatedStudents = [
  { name: "小明", seed: "xiaoming_abc123" },
  { name: "小華", seed: "xiaohua_def456" },
  { name: "阿強", seed: "aqiang_ghi789" },
  { name: "小美", seed: "xiaomei_jkl012" },
  { name: "大衛", seed: "dawei_mno345" },
  { name: "小芳", seed: "xiaofang_pqr678" },
];

const Classroom = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Assign each student to a unique island
    const shuffledIslands = [...Array(islandPositions.length).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, simulatedStudents.length);
    
    const assignedStudents = simulatedStudents.map((student, index) => ({
      id: index,
      name: student.name,
      avatarSeed: student.seed,
      islandIndex: shuffledIslands[index],
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
