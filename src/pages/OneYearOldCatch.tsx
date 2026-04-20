import { useState, useEffect } from "react";
import { Component as RadialIntro } from "@/components/ui/radial-intro";
import { fetchItems, Item } from "@/lib/api";

const OneYearOldCatch = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchItems();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  // Transform API items to RadialIntro format
  const catchItems = items.map((item, index) => ({
    id: index + 1,
    name: item.name,
    src: item.image_url,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-300 border-t-neutral-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-12 py-12">
      <div className="flex items-center gap-16">
        {/* Left - Title */}
        <div className="flex-shrink-0">
          <h1 className="text-5xl font-light tracking-wide text-neutral-800 leading-relaxed">
            小寶會抓到哪些好東西呢？
          </h1>
          <div className="w-12 h-px bg-neutral-300 mt-6" />
        </div>

        {/* Right - Radial intro */}
        <div className="border border-neutral-200 rounded-full p-8">
          <RadialIntro
            orbitItems={catchItems}
            stageSize={650}
            imageSize={80}
          />
        </div>
      </div>
    </div>
  );
};

export default OneYearOldCatch;
