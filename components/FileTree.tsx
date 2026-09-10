import { File, Folder } from "lucide-react";
import { FileItem } from "@/lib/types";

export default function FileTree({ files }: { files: FileItem[] }) {
  const top = files
    .filter((f) => !f.path.includes("/"))
    .sort((a, b) => Number(b.type === "tree") - Number(a.type === "tree"))
    .slice(0, 18);

  return (
    <div className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10">
      {top.map((item) => {
        const Icon = item.type === "tree" ? Folder : File;
        return (
          <div key={item.path} className="flex items-center gap-3 px-4 py-3 text-sm">
            <Icon className="h-4 w-4 text-zinc-500" />
            <span className="truncate text-zinc-300">{item.path}</span>
          </div>
        );
      })}
      {!top.length ? (
        <div className="px-4 py-6 text-sm text-zinc-500">No files found.</div>
      ) : null}
    </div>
  );
}
