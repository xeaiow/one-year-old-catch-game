import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { fetchAllGameResults, RandomPlayer } from "@/lib/api";

// Seeded random number generator for consistent layout
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate organically distributed positions
const generatePositions = (count: number, containerWidth: number, containerHeight: number) => {
  const avatarSize = 56;

  // Frosted glass container bounds (92% width, 90% height, centered)
  const glassWidth = containerWidth * 0.92;
  const glassHeight = containerHeight * 0.90;
  const glassLeft = (containerWidth - glassWidth) / 2;
  const glassTop = (containerHeight - glassHeight) / 2;

  // Padding from glass container edges
  const topPadding = glassTop + 50;
  const sidePadding = glassLeft + 40;

  const availableWidth = glassWidth - 80;
  const availableHeight = glassHeight - 95;

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
        x: Math.max(sidePadding + avatarSize / 2, Math.min(glassLeft + glassWidth - 40 - avatarSize / 2, baseX + jitterX + extraDisplaceX)),
        y: Math.max(topPadding + avatarSize / 2, Math.min(glassTop + glassHeight - 45 - avatarSize / 2, baseY + jitterY + extraDisplaceY)),
        size: avatarSize,
      });

      itemIndex++;
    }
  }

  return allPositions;
};

const Classroom = () => {
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 });
  const [players, setPlayers] = useState<RandomPlayer[]>([]);
  const [newPlayerIds, setNewPlayerIds] = useState<Set<string>>(new Set());
  const knownPlayerIds = useRef<Set<string>>(new Set());

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

  const fetchPlayers = useCallback(async () => {
    const result = await fetchAllGameResults();

    // Find new players
    const newIds = new Set<string>();
    result.forEach(player => {
      if (!knownPlayerIds.current.has(player.id)) {
        newIds.add(player.id);
        knownPlayerIds.current.add(player.id);
      }
    });

    if (newIds.size > 0) {
      setNewPlayerIds(newIds);
      // Clear animation state after animation completes
      setTimeout(() => {
        setNewPlayerIds(new Set());
      }, 600);
    }

    setPlayers(result);
  }, []);

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 10000);
    return () => clearInterval(interval);
  }, [fetchPlayers]);

  const students = useMemo(() => {
    if (players.length === 0) return [];

    const positions = generatePositions(players.length, containerSize.width, containerSize.height);

    return players.map((player, index) => ({
      id: player.id,
      name: player.player_name,
      avatarSeed: player.avatar_seed,
      x: positions[index]?.x || 0,
      y: positions[index]?.y || 0,
      size: positions[index]?.size || 64,
    }));
  }, [containerSize, players]);

  // Truncate name to 3 characters
  const truncateName = (name: string) => {
    return name.length > 3 ? name.slice(0, 3) + "..." : name;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <img
        src="/bg.avif"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Frosted glass container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] h-[90%] backdrop-blur-xl bg-white/30 rounded-3xl border border-white/40 shadow-2xl" />

      {/* Noise overlay layer */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] h-[90%] rounded-3xl opacity-80 pointer-events-none z-[1]"
        style={{ backgroundImage: 'url(/noise-overlay.png)', backgroundRepeat: 'repeat' }}
      />

      {/* Avatar cloud with glassmorphism cards */}
      {students.map((student) => {
        const isNew = newPlayerIds.has(student.id);
        return (
        <div
          key={student.id}
          className={`absolute flex flex-col items-center transition-all duration-300 hover:scale-110 hover:z-50 cursor-pointer group ${isNew ? 'animate-pop-in' : ''}`}
          style={{
            left: student.x,
            top: student.y,
            transform: 'translate(-50%, -50%)',
            zIndex: isNew ? 100 : Math.floor(student.y / 10),
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
                width: student.size-2,
                height: student.size-2,
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
            <span className="text-[12px] font-semibold text-neutral-800 drop-shadow-sm whitespace-nowrap">{truncateName(student.name)}</span>
          </div>
        </div>
      );
      })}

      {/* Header with glassmorphism */}
      <div className="absolute top-0 left-0 right-0 p-4 z-30">
        <div className="flex justify-center">
          <div className="px-5 py-2.5 backdrop-blur-xl bg-white/20 rounded-full border border-white/30 shadow-lg">
            <span className="text-sm text-gray-700 font-medium">已經有 {students.length} 人報到！</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
