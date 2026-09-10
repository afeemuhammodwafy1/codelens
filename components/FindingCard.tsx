import { AlertTriangle, CheckCircle2, CircleAlert, Info } from "lucide-react";
import { Finding } from "@/lib/types";

const iconMap = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  danger: CircleAlert,
};

export default function FindingCard({ finding }: { finding: Finding }) {
  const Icon = iconMap[finding.severity];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-zinc-300" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">{finding.title}</h3>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wider text-zinc-500">
              {finding.category}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{finding.description}</p>
          {finding.path ? (
            <code className="mt-3 inline-block rounded-md bg-black/30 px-2 py-1 text-xs text-zinc-500">
              {finding.path}
            </code>
          ) : null}
        </div>
      </div>
    </div>
  );
}
