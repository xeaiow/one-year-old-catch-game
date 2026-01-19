import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  emoji: string;
  duration: number;
  size: string;
}

const Confetti = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const emojis = ['💖', '⭐', '🌸', '✨', '💜', '💕', '🎀', '🌟', '💗', '🦋', '🧁', '🌈', '💫'];
    const sizes = ['text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
    const newPieces: ConfettiPiece[] = [];

    for (let i = 0; i < 40; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        duration: 2.5 + Math.random() * 2,
        size: sizes[Math.floor(Math.random() * sizes.length)],
      });
    }

    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            y: -60, 
            x: `${piece.x}vw`,
            rotate: 0,
            opacity: 1,
            scale: 0,
          }}
          animate={{ 
            y: '110vh',
            rotate: 720 + Math.random() * 360,
            opacity: [1, 1, 0],
            scale: [0, 1.2, 1],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className={`absolute ${piece.size}`}
        >
          {piece.emoji}
        </motion.div>
      ))}
      
      {/* Floating hearts that rise up */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          initial={{ 
            y: '100vh', 
            x: `${10 + i * 12}vw`,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{ 
            y: '-20vh',
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1],
            x: `${10 + i * 12 + (Math.random() - 0.5) * 10}vw`,
          }}
          transition={{
            duration: 3,
            delay: 0.5 + i * 0.15,
            ease: "easeOut",
          }}
          className="absolute text-2xl sm:text-3xl"
        >
          💖
        </motion.div>
      ))}
    </div>
  );
};

export default Confetti;
