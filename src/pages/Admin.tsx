import { useState } from "react";
import { clearAllGameResults, fetchAllGameResults } from "@/lib/api";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleRefreshCount = async () => {
    const players = await fetchAllGameResults();
    setPlayerCount(players.length);
  };

  const handleClear = async () => {
    if (!confirm("確定要清除所有遊戲結果嗎？此操作無法復原！")) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await clearAllGameResults();
      if (result.success) {
        setMessage("已成功清除所有遊戲結果！");
        setPlayerCount(0);
      } else {
        setMessage("清除失敗，請稍後再試");
      }
    } catch {
      setMessage("發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          後台管理
        </h1>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/70">目前參加人數</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {playerCount !== null ? playerCount : "—"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshCount}
                  className="text-white/50 hover:text-white hover:bg-white/10"
                >
                  刷新
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleClear}
            disabled={loading}
            variant="destructive"
            className="w-full py-6 text-lg"
          >
            {loading ? "清除中..." : "清除所有遊戲結果"}
          </Button>

          {message && (
            <div className={`text-center p-3 rounded-lg ${
              message.includes("成功")
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
