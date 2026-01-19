import { motion } from 'framer-motion';

const FloatingDecorations = () => {
  const decorations = [
    { emoji: '⭐', top: '8%', left: '6%', delay: 0, size: 'text-lg sm:text-xl' },
    { emoji: '💖', top: '12%', right: '8%', delay: 0.5, size: 'text-xl sm:text-2xl' },
    { emoji: '✨', top: '75%', left: '4%', delay: 1, size: 'text-lg sm:text-xl' },
    { emoji: '🌸', top: '82%', right: '6%', delay: 1.5, size: 'text-xl sm:text-2xl' },
    { emoji: '💜', top: '45%', left: '3%', delay: 0.3, size: 'text-lg' },
    { emoji: '🌟', top: '40%', right: '4%', delay: 0.8, size: 'text-xl' },
    { emoji: '💕', top: '20%', left: '92%', delay: 1.2, size: 'text-lg' },
    { emoji: '🦋', top: '65%', right: '92%', delay: 0.7, size: 'text-xl' },
    { emoji: '☁️', top: '30%', left: '8%', delay: 0.4, size: 'text-2xl opacity-40' },
    { emoji: '☁️', top: '55%', right: '10%', delay: 0.9, size: 'text-xl opacity-30' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {decorations.map((dec, i) => (
        <motion.span
          key={i}
          className={`absolute opacity-50 ${dec.size}`}
          style={{
            top: dec.top,
            left: dec.left,
            right: dec.right,
          }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 8, -8, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + i * 0.3,
            delay: dec.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {dec.emoji}
        </motion.span>
      ))}

      {/* Sparkle particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1.5 h-1.5 bg-primary rounded-full"
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${5 + Math.random() * 90}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.35,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingDecorations;
