import { motion } from 'framer-motion';

interface WinningLineProps {
  type: 'row' | 'col' | 'diag';
  index: number;
}

const WinningLine = ({ type, index }: WinningLineProps) => {
  const getLineStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      zIndex: 30,
    };

    const cellSize = 100 / 3;
    const center = cellSize / 2;

    if (type === 'row') {
      return {
        ...baseStyle,
        top: `${center + index * cellSize}%`,
        left: '5%',
        width: '90%',
        height: '8px',
        transform: 'translateY(-50%)',
      };
    }

    if (type === 'col') {
      return {
        ...baseStyle,
        left: `${center + index * cellSize}%`,
        top: '5%',
        height: '90%',
        width: '8px',
        transform: 'translateX(-50%)',
      };
    }

    // Diagonal from top-left to bottom-right [0,0] -> [1,1] -> [2,2]
    if (index === 0) {
      // Calculate diagonal length: sqrt(2) * grid size ≈ 1.414
      return {
        ...baseStyle,
        top: '0',
        left: '0',
        width: '141.4%',
        height: '8px',
        transform: 'rotate(45deg)',
        transformOrigin: '0 0',
      };
    }

    // Diagonal from top-right to bottom-left [0,2] -> [1,1] -> [2,0]
    return {
      ...baseStyle,
      top: '0',
      right: '0',
      width: '141.4%',
      height: '8px',
      transform: 'rotate(-45deg)',
      transformOrigin: '100% 0',
    };
  };

  return (
    <motion.div
      style={getLineStyle()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-full overflow-visible pointer-events-none"
    >
      {/* Glow backdrop */}
      <motion.div
        className="absolute inset-0 rounded-full blur-md"
        style={{
          background:
            'linear-gradient(90deg, hsl(var(--glow-pink)), hsl(var(--glow-lavender)), hsl(var(--glow-mint)))',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Main line */}
      <motion.div
        className="w-full h-full rounded-full relative"
        style={{
          background:
            'linear-gradient(90deg, hsl(var(--glow-pink)), hsl(var(--glow-lavender)), hsl(var(--glow-mint)))',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Sparkle particles along the line */}
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-sm"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.2,
            repeat: Infinity,
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: '-12px',
          }}
        >
          ✨
        </motion.span>
      ))}
    </motion.div>
  );
};

export default WinningLine;
