import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (name.trim()) {
      console.log("Joining with name:", name);
      // Future: navigate to game room
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      {/* Floating emojis decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-[10%] left-[15%] text-4xl animate-bounce" style={{ animationDelay: "0s" }}>👋</span>
        <span className="absolute top-[20%] right-[20%] text-3xl animate-bounce" style={{ animationDelay: "0.5s" }}>🎮</span>
        <span className="absolute bottom-[30%] left-[10%] text-3xl animate-bounce" style={{ animationDelay: "1s" }}>✨</span>
        <span className="absolute bottom-[20%] right-[15%] text-4xl animate-bounce" style={{ animationDelay: "0.3s" }}>🎯</span>
        <span className="absolute top-[40%] left-[5%] text-2xl animate-bounce" style={{ animationDelay: "0.7s" }}>🎲</span>
        <span className="absolute top-[15%] left-[50%] text-3xl animate-bounce" style={{ animationDelay: "0.2s" }}>🏆</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        {/* Logo/Title area with emoji */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            歡迎加入遊戲
          </h1>
        </div>

        {/* Name input */}
        <Input
          type="text"
          placeholder="您的名字"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-16 text-xl text-center bg-card border-2 border-border rounded-2xl placeholder:text-muted-foreground focus:border-foreground focus:ring-0 transition-all"
        />

        {/* Join button */}
        <Button
          onClick={handleJoin}
          variant="clubhouse"
          size="xl"
          className="w-full"
        >
          Join
        </Button>

        {/* Decorative footer */}
        <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
          <span>🌟</span>
          準備好一起玩了嗎？
          <span>🌟</span>
        </p>
      </div>
    </div>
  );
};

export default Index;
