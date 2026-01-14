import { useState, useEffect } from "react";

interface Seat {
  id: number;
  row: number;
  col: number;
  occupied: boolean;
  avatarSeed?: string;
  name?: string;
}

// Simulated students with random names
const simulatedStudents = [
  { name: "小明", seed: "xiaoming_abc123" },
  { name: "小華", seed: "xiaohua_def456" },
  { name: "阿強", seed: "aqiang_ghi789" },
  { name: "小美", seed: "xiaomei_jkl012" },
  { name: "大衛", seed: "dawei_mno345" },
  { name: "小芳", seed: "xiaofang_pqr678" },
];

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = 4;
  const cols = 5;
  
  // Randomly assign some students to seats
  const occupiedPositions = new Set<number>();
  simulatedStudents.forEach(() => {
    let pos;
    do {
      pos = Math.floor(Math.random() * (rows * cols));
    } while (occupiedPositions.has(pos));
    occupiedPositions.add(pos);
  });
  
  let studentIndex = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = row * cols + col;
      const isOccupied = occupiedPositions.has(id);
      seats.push({
        id,
        row,
        col,
        occupied: isOccupied,
        avatarSeed: isOccupied ? simulatedStudents[studentIndex]?.seed : undefined,
        name: isOccupied ? simulatedStudents[studentIndex]?.name : undefined,
      });
      if (isOccupied) studentIndex++;
    }
  }
  
  return seats;
};

const Classroom = () => {
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    setSeats(generateSeats());
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
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/30 to-transparent">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white drop-shadow-lg">教室</h1>
          <p className="text-white/80 text-sm mt-1 drop-shadow">今日出席人數：{seats.filter(s => s.occupied).length} 人</p>
        </div>
      </div>

      {/* Avatars positioned on the island */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[280px] h-[280px]">
          {seats.filter(s => s.occupied).map((seat, index) => {
            // Position avatars in a circular pattern on the island
            const totalOccupied = seats.filter(s => s.occupied).length;
            const angle = (index / totalOccupied) * 2 * Math.PI - Math.PI / 2;
            const radius = 80;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <div
                key={seat.id}
                className="absolute left-1/2 top-1/2 flex flex-col items-center transition-all duration-300 hover:scale-110 cursor-pointer"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/90 shadow-xl">
                  <img
                    src={`https://tapback.co/api/avatar/${seat.avatarSeed}.webp`}
                    alt={seat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-1 px-2 py-0.5 bg-white/90 rounded-full shadow-md">
                  <span className="text-[10px] font-medium text-foreground">{seat.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/30 to-transparent">
        <div className="flex justify-center gap-4 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/80 border border-white"></div>
            <span className="drop-shadow">已入座</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
