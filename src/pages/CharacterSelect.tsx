import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { RefreshCw } from "lucide-react";

const generateRandomString = (length: number) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const CharacterSelect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = (location.state as { name?: string })?.name || "Guest";

  const [avatarSeed, setAvatarSeed] = useState(() => userName + generateRandomString(6));
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const avatarUrl = `https://tapback.co/api/avatar/${avatarSeed}.webp`;

  const handleRegenerate = () => {
    setIsLoading(true);
    setAvatarSeed(userName + generateRandomString(6));
  };

  const handleComplete = () => {
    // Fire confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
    });

    // Fire more confetti from sides
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
      });
    }, 200);

    // Show success message after confetti
    setTimeout(() => {
      setIsComplete(true);
    }, 800);
  };

  // Success screen
  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <div className="text-center">
          <span className="text-6xl mb-6 block">🎉</span>
          <h1 className="text-4xl font-bold text-foreground mb-4">簽到成功</h1>
          <p className="text-muted-foreground text-lg">網頁先別關，等等還要玩小遊戲</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <img
        src="/Gemini_Generated_Image_iskfqviskfqviskf.avif"
        alt="Island background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

      {/* Avatar positioned on the island */}
      <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/80 bg-card shadow-2xl">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="w-6 h-6 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
              </div>
            )}
            <img
              src={avatarUrl}
              alt="Avatar"
              className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        </div>
        {/* Name label */}
        <div className="mt-2 px-3 py-1 bg-white/90 rounded-full shadow-lg">
          <span className="text-sm font-medium text-foreground">{userName}</span>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-gradient-to-t from-black/40 to-transparent">
        <div className="max-w-md mx-auto flex flex-col items-center gap-4">
          <p className="text-white/90 text-sm font-medium">選擇你的角色形象</p>
          
          {/* Regenerate button */}
          <Button
            onClick={handleRegenerate}
            variant="outline"
            size="lg"
            className="gap-2 rounded-full px-6 bg-white/90 border-white/50 text-foreground hover:bg-white"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            重新生成
          </Button>

          {/* Complete button */}
          <Button onClick={handleComplete} variant="clubhouse" size="xl" className="w-full">
            完成
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;
