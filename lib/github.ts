import { FileItem, LanguageItem, RepoMeta } from "@/lib/types";

const API = "https://api.github.com";

function headers() {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "WafyCodeLens",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function gh<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: headers(),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("Repository not found or not public.");
    if (response.status === 403) throw new Error("GitHub API rate limit reached. Add GITHUB_TOKEN in your deployment environment.");
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchRepo(owner: string, repo: string): Promise<RepoMeta> {
  const data = await gh<any>(`${API}/repos/${owner}/${repo}`);
  return {
    name: data.name,
    fullName: data.full_name,
    owner: data.owner.login,
    description: data.description,
    htmlUrl: data.html_url,
    defaultBranch: data.default_branch,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    watchers: data.subscribers_count ?? data.watchers_count ?? 0,
    language: data.language,
    license: data.license?.spdx_id ?? null,
    updatedAt: data.updated_at,
  };
}

export async function fetchLanguages(owner: string, repo: string): Promise<LanguageItem[]> {
  const data = await gh<Record<string, number>>(`${API}/repos/${owner}/${repo}/languages`);
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(data)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Number(((bytes / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export async function fetchTree(owner: string, repo: string, branch: string): Promise<FileItem[]> {
  const data = await gh<any>(
    `${API}/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`
  );
  return (data.tree ?? [])
    .filter((item: any) => item.type === "blob" || item.type === "tree")
    .slice(0, 5000)
    .map((item: any) => ({
      path: item.path,
      type: item.type,
      size: item.size,
    }));
}

export async function fetchReadme(owner: string, repo: string): Promise<string | null> {
  const response = await fetch(`${API}/repos/${owner}/${repo}/readme`, {
    headers: {
      ...headers(),
      Accept: "application/vnd.github.raw+json",
    },
    next: { revalidate: 300 },
  });

  if (response.status === 404) return null;
  if (!response.ok) return null;
  return response.text();
}
