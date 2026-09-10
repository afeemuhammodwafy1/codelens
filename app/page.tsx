import { Github } from "lucide-react";
import Analyzer from "@/components/Analyzer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2 font-medium tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <Github className="h-4 w-4" />
            </span>
            WafyCodeLens
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-500 transition hover:text-zinc-200"
          >
            GitHub
          </a>
        </div>
      </header>

      <Analyzer />

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>WafyCodeLens</span>
          <span>Built for repository exploration and engineering review.</span>
        </div>
      </footer>
    </main>
  );
}
