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

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="text-sm text-zinc-500">Why WafyCodeLens?</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                A practical first look at how a repository is built.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
                WafyCodeLens turns GitHub repository metadata and lightweight
                engineering heuristics into an easy-to-read report. It helps
                developers quickly spot documentation gaps, testing signals,
                structural concerns, large source files, and basic repository
                security hygiene.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
              <p className="text-sm text-zinc-500">Created by</p>
              <h3 className="mt-2 text-lg font-medium">Afee Muhammod Wafy</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                A software developer building web applications, developer
                tools, security-focused experiments, and API-driven projects.
              </p>
              <a href="https://amwafy.xyz" target="_blank" rel="noreferrer"
                className="mt-4 inline-block text-sm text-zinc-200 hover:text-white">
                Visit creator portfolio
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Repository overview", "Stars, forks, languages, issues, license, and update information."],
              ["Engineering signals", "Lightweight checks for code organization, testing, documentation, and maintainability."],
              ["Security hygiene", "Basic repository-level signals such as .gitignore and sensitive-looking files."],
              ["Actionable findings", "Readable findings that explain what may deserve a closer engineering review."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="font-medium">How the analysis works</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {[
                ["01", "Repository", "Read public GitHub repository metadata and structure."],
                ["02", "Inspect", "Review files, languages, README, tests, dependencies, and basic hygiene."],
                ["03", "Score", "Combine transparent heuristics into category and overall scores."],
                ["04", "Review", "Use the findings as a starting point for deeper engineering analysis."],
              ].map(([number, title, description]) => (
                <div key={number} className="border-l border-white/10 pl-4">
                  <div className="text-xs text-zinc-600">{number}</div>
                  <div className="mt-2 font-medium">{title}</div>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>WafyCodeLens</span>
          <span>Built for repository exploration and engineering review.</span>
        </div>
      </footer>
    </main>
  );
}
