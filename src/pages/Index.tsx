import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (name.trim()) {
      navigate("/character", { state: { name: name.trim() } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      {/* Floating emojis decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-[24%] left-[15%] text-4xl animate-bounce" style={{ animationDelay: "0s" }}>
          👋
        </span>
        <span className="absolute top-[28%] right-[15%] text-3xl animate-bounce" style={{ animationDelay: "0.5s" }}>
          🎮
        </span>
        <span className="absolute top-[15%] left-[50%] text-3xl animate-bounce" style={{ animationDelay: "0.2s" }}>
          🎲
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
        {/* Logo/Title area with emoji */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            歡迎您來參加
            <br />
            吳涵晞的抓周儀式
          </h1>
        </div>

        {/* Name input */}
        <Input
          type="text"
          placeholder="你的名字"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-16 text-xl text-center bg-card border-2 border-border rounded-2xl placeholder:text-gray-400 focus:border-foreground focus:ring-0 transition-all"
        />

        {/* Join button */}
        <Button onClick={handleJoin} variant="clubhouse" size="xl" className="w-full">
          Join
        </Button>
      </div>
    </div>
  );
};

export default Index;
