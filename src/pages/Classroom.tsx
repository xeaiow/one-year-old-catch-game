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
    <div className="min-h-screen bg-background px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-4xl mb-4 block">🏫</span>
        <h1 className="text-2xl font-bold text-foreground">教室</h1>
        <p className="text-muted-foreground text-sm mt-2">今日出席人數：{seats.filter(s => s.occupied).length} 人</p>
      </div>

      {/* Teacher's desk */}
      <div className="max-w-md mx-auto mb-12">
        <div className="bg-foreground/10 rounded-xl py-3 px-6 text-center">
          <span className="text-sm text-muted-foreground">講台</span>
        </div>
      </div>

      {/* Seats grid */}
      <div className="max-w-lg mx-auto">
        <div className="grid grid-cols-5 gap-4">
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={`
                aspect-square rounded-2xl flex flex-col items-center justify-center
                transition-all duration-200
                ${seat.occupied 
                  ? 'bg-foreground/5 hover:bg-foreground/10 cursor-pointer' 
                  : 'bg-foreground/[0.02] border-2 border-dashed border-foreground/10'
                }
              `}
            >
              {seat.occupied ? (
                <>
                  <img
                    src={`https://tapback.co/api/avatar/${seat.avatarSeed}.webp`}
                    alt={seat.name}
                    className="w-10 h-10 rounded-full mb-1"
                  />
                  <span className="text-xs text-foreground/70 truncate max-w-full px-1">
                    {seat.name}
                  </span>
                </>
              ) : (
                <span className="text-foreground/20 text-lg">🪑</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-lg mx-auto mt-12 flex justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-foreground/5"></div>
          <span>已入座</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-dashed border-foreground/10"></div>
          <span>空位</span>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
