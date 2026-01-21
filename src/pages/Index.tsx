import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPlayersAutocomplete, Player } from "@/lib/api";

const Index = () => {
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (name.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const players = await fetchPlayersAutocomplete(name);
        setSuggestions(players);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [name]);

  const handleJoin = () => {
    if (name.trim()) {
      navigate("/character", { state: { name: name.trim() } });
    }
  };

  const handleSelectSuggestion = (player: Player) => {
    setName(player.name);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => setShowSuggestions(false), 200);
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

        {/* Name input with autocomplete */}
        <div className="relative w-full">
          <Input
            ref={inputRef}
            type="text"
            placeholder="你的名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJoin();
            }}
            className="w-full h-16 text-xl text-center bg-card border-2 border-border rounded-2xl placeholder:text-gray-400 focus:border-foreground focus:ring-0 transition-all"
          />

          {/* Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-lg overflow-hidden z-20">
              {suggestions.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleSelectSuggestion(player)}
                  className="w-full px-4 py-3 text-left text-lg hover:bg-muted transition-colors border-b last:border-b-0 border-border"
                >
                  {player.name}
                </button>
              ))}
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && name.trim().length > 0 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Join button */}
        <Button onClick={handleJoin} variant="clubhouse" size="xl" className="w-full">
          Join
        </Button>
      </div>
    </div>
  );
};

export default Index;
