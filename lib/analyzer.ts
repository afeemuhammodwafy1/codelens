import { AnalysisResult, FileItem, Finding, ScoreGroup } from "@/lib/types";
import { fetchLanguages, fetchReadme, fetchRepo, fetchTree } from "@/lib/github";

const SOURCE_EXT = /\.(js|jsx|ts|tsx|py|java|go|rs|php|rb|cs|cpp|c|h|vue|svelte)$/i;
const TEST_PATTERN = /(^|\/)(__tests__|tests?|spec)(\/|$)|\.(test|spec)\.[^.]+$/i;
const DOC_NAMES = /(^|\/)(readme|contributing|code_of_conduct|security|changelog)(\.[^/]+)?$/i;
const DEP_NAMES = /(^|\/)(package\.json|requirements\.txt|pyproject\.toml|pom\.xml|build\.gradle|go\.mod|cargo\.toml|composer\.json|gemfile)$/i;
const SECRETISH = /(api[_-]?key|secret|token|password|private[_-]?key)/i;

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function addFinding(findings: Finding[], f: Finding) {
  findings.push(f);
}

function analyzeFiles(files: FileItem[], readme: string | null) {
  const findings: Finding[] = [];
  const blobs = files.filter((f) => f.type === "blob");
  const source = blobs.filter((f) => SOURCE_EXT.test(f.path));
  const tests = blobs.filter((f) => TEST_PATTERN.test(f.path));
  const dependencyFiles = blobs.filter((f) => DEP_NAMES.test(f.path)).map((f) => f.path);
  const docsFiles = blobs.filter((f) => DOC_NAMES.test(f.path)).map((f) => f.path);
  const largeFiles = source.filter((f) => (f.size ?? 0) > 100_000);
  const suspiciousNames = blobs.filter((f) => SECRETISH.test(f.path) && !/example|sample|template/i.test(f.path));

  if (!readme) {
    addFinding(findings, {
      category: "Documentation",
      severity: "warning",
      title: "README not found",
      description: "A clear README is one of the strongest signals that a repository is maintainable and easy to evaluate.",
    });
  } else {
    const lower = readme.toLowerCase();
    if (!/(install|setup|getting started)/i.test(lower)) {
      addFinding(findings, {
        category: "Documentation",
        severity: "info",
        title: "Installation section may be missing",
        description: "Add setup or installation instructions so contributors can run the project quickly.",
      });
    }
    if (!/(usage|example|how to use)/i.test(lower)) {
      addFinding(findings, {
        category: "Documentation",
        severity: "info",
        title: "Usage guidance may be missing",
        description: "Add a short usage section or examples to improve onboarding.",
      });
    }
  }

  if (tests.length === 0 && source.length > 5) {
    addFinding(findings, {
      category: "Testing",
      severity: "warning",
      title: "No obvious test files detected",
      description: "The repository has source files but no conventional test directory or *.test / *.spec files were detected.",
    });
  } else if (tests.length > 0) {
    addFinding(findings, {
      category: "Testing",
      severity: "success",
      title: "Test files detected",
      description: `${tests.length} test-like files were found using common naming conventions.`,
    });
  }

  if (largeFiles.length > 0) {
    addFinding(findings, {
      category: "Code Quality",
      severity: "warning",
      title: "Large source files detected",
      description: `${largeFiles.length} source file(s) are larger than 100 KB. Large files can be a maintainability signal worth reviewing.`,
      path: largeFiles[0]?.path,
    });
  }

  if (suspiciousNames.length > 0) {
    addFinding(findings, {
      category: "Security",
      severity: "warning",
      title: "Sensitive-looking filenames detected",
      description: "Some filenames contain words commonly associated with secrets. This is only a heuristic; manually verify whether sensitive data is actually committed.",
      path: suspiciousNames[0]?.path,
    });
  }

  const hasGitignore = blobs.some((f) => f.path.toLowerCase() === ".gitignore");
  if (!hasGitignore) {
    addFinding(findings, {
      category: "Security",
      severity: "info",
      title: ".gitignore not detected",
      description: "Consider adding .gitignore to reduce the chance of committing local secrets, build output, or environment files.",
    });
  }

  const envCommitted = blobs.some((f) => /(^|\/)\.env($|\.)/i.test(f.path) && !/example|sample|template/i.test(f.path));
  if (envCommitted) {
    addFinding(findings, {
      category: "Security",
      severity: "danger",
      title: "Environment file detected",
      description: "A .env-like file appears in the repository tree. Verify immediately that it does not contain credentials or private configuration.",
    });
  }

  const rootFolders = files.filter((f) => f.type === "tree" && !f.path.includes("/")).map((f) => f.path);
  if (source.length > 20 && rootFolders.length <= 1) {
    addFinding(findings, {
      category: "Maintainability",
      severity: "info",
      title: "Flat repository structure",
      description: "The project contains many source files but very few top-level directories. Consider whether clearer module boundaries would help.",
    });
  }

  if (findings.length === 0) {
    addFinding(findings, {
      category: "Overview",
      severity: "success",
      title: "No major heuristic issues detected",
      description: "The lightweight checks did not find obvious repository hygiene problems.",
    });
  }

  const documentation = clamp(
    55 +
      (readme ? 25 : -25) +
      Math.min(20, docsFiles.length * 4) +
      (readme && /(install|setup|getting started)/i.test(readme) ? 8 : 0) +
      (readme && /(usage|example|how to use)/i.test(readme) ? 8 : 0)
  );

  const testing = source.length === 0
    ? 60
    : clamp(30 + Math.min(70, (tests.length / Math.max(1, source.length)) * 350));

  const security = clamp(
    88
      - (suspiciousNames.length ? 12 : 0)
      - (envCommitted ? 35 : 0)
      - (!hasGitignore ? 8 : 0)
  );

  const codeQuality = clamp(
    86
      - Math.min(25, largeFiles.length * 5)
      + (rootFolders.length >= 2 ? 6 : 0)
  );

  const maintainability = clamp(
    72
      + (readme ? 8 : 0)
      + (tests.length > 0 ? 8 : 0)
      + (dependencyFiles.length > 0 ? 4 : 0)
      + (rootFolders.length >= 2 ? 6 : 0)
      - Math.min(20, largeFiles.length * 3)
  );

  const overall = clamp(
    codeQuality * 0.25 +
      security * 0.2 +
      documentation * 0.2 +
      testing * 0.15 +
      maintainability * 0.2
  );

  const scores: ScoreGroup = {
    codeQuality,
    security,
    documentation,
    testing,
    maintainability,
    overall,
  };

  return {
    findings,
    scores,
    stats: {
      totalFiles: blobs.length,
      sourceFiles: source.length,
      testFiles: tests.length,
      dependencyFiles,
      docsFiles,
      todoCount: 0,
      largeFiles: largeFiles.length,
      secretSignals: suspiciousNames.length + (envCommitted ? 1 : 0),
    },
  };
}

export async function analyzeRepository(owner: string, repoName: string): Promise<AnalysisResult> {
  const repo = await fetchRepo(owner, repoName);
  const [languages, files, readme] = await Promise.all([
    fetchLanguages(owner, repoName),
    fetchTree(owner, repoName, repo.defaultBranch),
    fetchReadme(owner, repoName),
  ]);

  const local = analyzeFiles(files, readme);

  return {
    repo,
    languages,
    files,
    readme,
    ...local,
  };
}
