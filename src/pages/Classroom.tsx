import { useState, useEffect, useMemo } from "react";

// Chinese names for 50 simulated students
const chineseNames = [
  "小明", "小華", "阿強", "小美", "大衛", "小芳", "志明", "春嬌", "阿傑", "小琳",
  "建國", "美玲", "俊宏", "雅婷", "家豪", "怡君", "冠宇", "佩珊", "柏翰", "欣怡",
  "承恩", "雨涵", "宇軒", "思妤", "博文", "詩涵", "浩然", "語彤", "睿哲", "心怡",
  "子豪", "雅琪", "彥廷", "佳穎", "宗翰", "宜蓁", "品睿", "芷晴", "奕辰", "詩婷",
  "昱翔", "筱涵", "瀚文", "羽彤", "鈺翔", "晨曦", "皓軒", "紫涵", "宸安", "若彤"
];

// Seeded random number generator for consistent layout
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate random string for avatar seed
const generateRandomString = (length: number, seed: number) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(seededRandom(seed + i) * chars.length));
  }
  return result;
};

// Generate organically distributed positions
const generatePositions = (count: number, containerWidth: number, containerHeight: number) => {
  const avatarSize = 56;

  // Padding from edges
  const topPadding = 50;
  const bottomPadding = 45;
  const sidePadding = 40;

  const availableWidth = containerWidth - 2 * sidePadding;
  const availableHeight = containerHeight - topPadding - bottomPadding;

  // Calculate optimal grid size for count items
  const aspectRatio = availableWidth / availableHeight;
  const cols = Math.ceil(Math.sqrt(count * aspectRatio));
  const rows = Math.ceil(count / cols);

  // Cell size
  const cellHeight = availableHeight / rows;

  // Calculate how many items per row to distribute evenly
  const baseItemsPerRow = Math.floor(count / rows);
  const extraItems = count % rows;

  // Generate all grid positions first
  const allPositions: { x: number; y: number; size: number }[] = [];
  let itemIndex = 0;

  for (let row = 0; row < rows; row++) {
    const itemsInThisRow = baseItemsPerRow + (row < extraItems ? 1 : 0);
    const rowCellWidth = availableWidth / itemsInThisRow;

    // Add row-level horizontal offset for staggered look
    const rowOffset = (seededRandom(row * 77) - 0.5) * rowCellWidth * 0.3;

    for (let col = 0; col < itemsInThisRow; col++) {
      // Base position at center of cell
      const baseX = sidePadding + col * rowCellWidth + rowCellWidth / 2 + rowOffset;
      const baseY = topPadding + row * cellHeight + cellHeight / 2;

      // Add larger jitter for more organic feel
      const seed = itemIndex * 17 + row * 31 + 7;
      const maxJitterX = rowCellWidth * 0.35;
      const maxJitterY = cellHeight * 0.3;
      const jitterX = (seededRandom(seed) - 0.5) * 2 * maxJitterX;
      const jitterY = (seededRandom(seed + 100) - 0.5) * 2 * maxJitterY;

      // Additional random displacement
      const extraDisplaceX = (seededRandom(seed + 200) - 0.5) * 20;
      const extraDisplaceY = (seededRandom(seed + 300) - 0.5) * 15;

      allPositions.push({
        x: Math.max(sidePadding + avatarSize / 2, Math.min(containerWidth - sidePadding - avatarSize / 2, baseX + jitterX + extraDisplaceX)),
        y: Math.max(topPadding + avatarSize / 2, Math.min(containerHeight - bottomPadding - avatarSize / 2, baseY + jitterY + extraDisplaceY)),
        size: avatarSize,
      });

      itemIndex++;
    }
  }

  return allPositions;
};

const Classroom = () => {
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const students = useMemo(() => {
    const positions = generatePositions(50, containerSize.width, containerSize.height);

    return chineseNames.map((name, index) => ({
      id: index,
      name,
      avatarSeed: `${name}_${generateRandomString(6, index * 100)}`,
      x: positions[index]?.x || 0,
      y: positions[index]?.y || 0,
      size: positions[index]?.size || 64,
    }));
  }, [containerSize]);

  // Truncate name to 3 characters
  const truncateName = (name: string) => {
    return name.length > 3 ? name.slice(0, 3) + "..." : name;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <img
        src="/bg.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Avatar cloud with glassmorphism cards */}
      {students.map((student) => (
        <div
          key={student.id}
          className="absolute flex flex-col items-center transition-all duration-300 hover:scale-110 hover:z-50 cursor-pointer group"
          style={{
            left: student.x,
            top: student.y,
            transform: 'translate(-50%, -50%)',
            zIndex: Math.floor(student.y / 10),
          }}
        >
          {/* Glassmorphism avatar container */}
          <div
            className="rounded-full backdrop-blur-md bg-white/25 p-1 border border-white/40 shadow-lg group-hover:shadow-xl group-hover:bg-white/35 transition-all"
            style={{
              width: student.size + 8,
              height: student.size + 8,
            }}
          >
            <div
              className="rounded-full overflow-hidden"
              style={{
                width: student.size,
                height: student.size,
              }}
            >
              <img
                src={`https://tapback.co/api/avatar/${student.avatarSeed}.webp`}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name tag with glassmorphism */}
          <div className="mt-1.5 px-2.5 py-0.5 backdrop-blur-xl bg-white/30 rounded-full border border-white/40 shadow-md">
            <span className="text-[10px] font-semibold text-white drop-shadow-sm whitespace-nowrap">{truncateName(student.name)}</span>
          </div>
        </div>
      ))}

      {/* Footer with glassmorphism */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
        <div className="flex justify-center">
          <div className="px-5 py-2.5 backdrop-blur-xl bg-white/20 rounded-full border border-white/30 shadow-lg">
            <span className="text-sm text-white/90 drop-shadow-sm">已經有 {students.length} 人報到！</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
