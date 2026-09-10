import { NextRequest, NextResponse } from "next/server";
import { analyzeRepository } from "@/lib/analyzer";

export const runtime = "nodejs";

function parseGitHubUrl(input: string) {
  const trimmed = input.trim().replace(/\.git$/, "");
  let url: URL;

  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Enter a valid GitHub repository URL.");
  }

  if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
    throw new Error("Only github.com repository URLs are supported.");
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new Error("Repository URL must include owner and repository name.");
  }

  return { owner: parts[0], repo: parts[1] };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { owner, repo } = parseGitHubUrl(String(body?.url ?? ""));
    const result = await analyzeRepository(owner, repo);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
