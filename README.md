# WafyCodeLens

A portfolio-grade GitHub repository analyzer built with Next.js, TypeScript, Tailwind CSS, and the GitHub REST API.

## Features

- Analyze any public GitHub repository by URL
- Repository metadata: stars, forks, language, update time
- Language breakdown
- Repository file-tree preview
- Documentation checks
- Test-file detection
- Large source-file detection
- Basic repository security signals
- Maintainability heuristics
- Weighted overall score
- Responsive dark developer-tool UI
- No database required for the MVP
- Optional server-side GitHub token support

## Important note

WafyCodeLens uses lightweight heuristics. It is not a replacement for professional security auditing, verified code coverage, or full static analysis.

## Local setup

1. Install Node.js 18.17 or newer.
2. Clone or extract this project.
3. Install dependencies:

```bash
npm install
```

4. Copy the example environment file:

```bash
cp .env.example .env.local
```

On Windows, create `.env.local` manually if needed.

5. Optionally add a GitHub personal access token:

```env
GITHUB_TOKEN=your_token_here
```

A token is optional for public repositories but helps with GitHub API rate limits. Never expose this value in client-side code.

6. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy free on Vercel

1. Push this folder to a GitHub repository.
2. Sign in to Vercel.
3. Import the GitHub repository.
4. Add `GITHUB_TOKEN` under Project Settings > Environment Variables if you want higher GitHub API limits.
5. Deploy.

No database or paid hosting is required for this MVP.

## Architecture

```text
Browser
  |
  v
Next.js UI
  |
  v
/api/analyze
  |
  +--> GitHub REST API
  |
  +--> Local analysis engine
  |
  v
Analysis JSON
  |
  v
Dashboard
```

## Suggested next upgrades

- Cache analysis results
- Add GitHub OAuth
- Add deeper source parsing with AST tools
- Add dependency vulnerability lookup
- Add shareable analysis pages
- Add PostgreSQL history
- Add AI repository explanations only after the core analyzer is stable

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- lucide-react
- GitHub REST API
- Vercel
