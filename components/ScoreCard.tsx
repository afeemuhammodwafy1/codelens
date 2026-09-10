"use client";

type Props = {
  label: string;
  score: number;
};

export default function ScoreCard({ label, score }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-3 flex items-end gap-2">
        <div className="text-3xl font-semibold tracking-tight">{score}</div>
        <div className="pb-1 text-sm text-zinc-500">/100</div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
