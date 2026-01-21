import { useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avatarUrl = `https://tapback.co/api/avatar/${avatarSeed}.webp`;

  const handleRegenerate = () => {
    setIsLoading(true);
    setAvatarSeed(userName + generateRandomString(6));
  };

  const handleComplete = () => {
    setIsSubmitting(true);

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

    // Navigate to guess page after confetti
    setTimeout(() => {
      navigate("/guess", { state: { name: userName, avatarSeed } });
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        {/* Title */}
        <div className="text-center mb-4">
          <span className="text-5xl mb-4 block">👋</span>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">你好，{userName}！</h1>
        </div>

        {/* Avatar display */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-foreground/10 bg-card shadow-lg">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="w-8 h-8 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
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

        {/* Regenerate button */}
        <button
          onClick={handleRegenerate}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="underline underline-offset-4">重新產生</span>
        </button>

        {/* Complete button */}
        <Button onClick={handleComplete} variant="clubhouse" size="xl" className="w-full mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "完成"}
        </Button>
      </div>
    </div>
  );
};

export default CharacterSelect;
