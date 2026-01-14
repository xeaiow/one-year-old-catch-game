import { useState, useEffect } from "react";

interface Student {
  id: number;
  name: string;
  avatarSeed: string;
  islandIndex: number;
}

// Pre-defined island positions (percentage-based for responsiveness)
// These coordinates map to the green island areas in the background image
const islandPositions = [
  { x: 8, y: 5 },    // Top-left island
  { x: 35, y: 8 },   // Top-center island
  { x: 85, y: 5 },   // Top-right volcano island
  { x: 5, y: 28 },   // Left large island
  { x: 28, y: 32 },  // Center-left island with palms
  { x: 55, y: 25 },  // Center island
  { x: 78, y: 30 },  // Right side island
  { x: 8, y: 55 },   // Bottom-left triangle island
  { x: 30, y: 58 },  // Bottom center-left
  { x: 55, y: 52 },  // Bottom center
  { x: 75, y: 55 },  // Bottom right island
  { x: 20, y: 78 },  // Very bottom left
  { x: 50, y: 82 },  // Very bottom center (large island)
  { x: 80, y: 80 },  // Very bottom right
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
        src="/Gemini_Generated_Image_iskfqviskfqviskf.avif"
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
