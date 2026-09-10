import { LanguageItem } from "@/lib/types";

export default function LanguageBars({ items }: { items: LanguageItem[] }) {
  if (!items.length) {
    return <p className="text-sm text-zinc-500">No language data available.</p>;
  }

  return (
    <div className="space-y-4">
      {items.slice(0, 8).map((item) => (
        <div key={item.name}>
          <div className="mb-2 flex justify-between text-sm">
            <span>{item.name}</span>
            <span className="text-zinc-500">{item.percentage}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/80"
              style={{ width: `${Math.max(1, item.percentage)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
