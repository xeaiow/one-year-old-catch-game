import { Component as RadialIntro } from "@/components/ui/radial-intro";

// 抓周物品
const catchItems = [
  { id: 1, name: "物品1", src: "/1.avif" },
  { id: 2, name: "物品2", src: "/2.avif" },
  { id: 3, name: "物品3", src: "/3.avif" },
  { id: 4, name: "物品4", src: "/4.avif" },
  { id: 5, name: "物品5", src: "/5.avif" },
  { id: 6, name: "物品6", src: "/6.avif" },
  { id: 7, name: "物品7", src: "/7.avif" },
  { id: 8, name: "物品8", src: "/8.avif" },
  { id: 9, name: "物品9", src: "/9.avif" },
  { id: 10, name: "物品10", src: "/10.avif" },
  { id: 11, name: "物品11", src: "/11.avif" },
  { id: 12, name: "物品12", src: "/12.avif" },
];

const OneYearOldCatch = () => {
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
