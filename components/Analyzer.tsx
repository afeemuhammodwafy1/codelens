"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  FileCode2,
  GitFork,
  Github,
  Search,
  Star,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import ScoreCard from "@/components/ScoreCard";
import FindingCard from "@/components/FindingCard";
import LanguageBars from "@/components/LanguageBars";
import FileTree from "@/components/FileTree";

export default function Analyzer() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <FileCode2 className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Understand a GitHub repository faster.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            WafyCodeLens inspects public repositories for structure, documentation,
            testing, maintainability, and lightweight security signals.
          </p>

          <form onSubmit={submit} className="mx-auto mt-10 max-w-2xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-2 shadow-soft sm:flex-row">
              <div className="flex flex-1 items-center gap-3 px-3">
                <Github className="h-5 w-5 shrink-0 text-zinc-500" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-zinc-600"
                  placeholder="https://github.com/owner/repository"
                  required
                />
              </div>
              <button
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Analyzing..." : "Analyze repository"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </div>
            <p className="mt-3 text-xs text-zinc-600">
              Public GitHub repositories only. No credentials are sent to the browser.
            </p>
            {error ? (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-200">
                {error}
              </div>
            ) : null}
          </form>
        </div>
      </section>

      {result ? (
        <section id="results" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm text-zinc-500">Repository analysis</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {result.repo.fullName}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                  {result.repo.description || "No repository description provided."}
                </p>
              </div>
              <a
                href={result.repo.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white"
              >
                Open on GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 sm:col-span-2 lg:col-span-2">
                <div className="text-sm text-zinc-400">Overall score</div>
                <div className="mt-4 text-6xl font-semibold tracking-tight">
                  {result.scores.overall}
                </div>
                <div className="mt-2 text-sm text-zinc-500">out of 100</div>
              </div>
              <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-5">
                <ScoreCard label="Code quality" score={result.scores.codeQuality} />
                <ScoreCard label="Security" score={result.scores.security} />
                <ScoreCard label="Documentation" score={result.scores.documentation} />
                <ScoreCard label="Testing" score={result.scores.testing} />
                <ScoreCard label="Maintainability" score={result.scores.maintainability} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon={<Star className="h-4 w-4" />} label="Stars" value={result.repo.stars} />
              <Stat icon={<GitFork className="h-4 w-4" />} label="Forks" value={result.repo.forks} />
              <Stat icon={<FileCode2 className="h-4 w-4" />} label="Source files" value={result.stats.sourceFiles} />
              <Stat icon={<Search className="h-4 w-4" />} label="Test files" value={result.stats.testFiles} />
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Panel title="Languages">
                <LanguageBars items={result.languages} />
              </Panel>
              <Panel title="Repository structure">
                <FileTree files={result.files} />
              </Panel>
            </div>

            <div className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Findings</h3>
                <span className="text-sm text-zinc-500">{result.findings.length} items</span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {result.findings.map((f, i) => (
                  <FindingCard key={`${f.title}-${i}`} finding={f} />
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-sm leading-6 text-zinc-500">
              WafyCodeLens uses lightweight heuristics and GitHub metadata. Scores are indicators, not a substitute for a professional security audit, static-analysis suite, or verified test coverage report.
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-2xl font-medium">{value}</div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
      <h3 className="mb-5 text-lg font-medium">{title}</h3>
      {children}
    </div>
  );
}
