export type Severity = "info" | "warning" | "danger" | "success";

export type Finding = {
  category: string;
  severity: Severity;
  title: string;
  description: string;
  path?: string;
};

export type RepoMeta = {
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  htmlUrl: string;
  defaultBranch: string;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string | null;
  license: string | null;
  updatedAt: string;
};

export type LanguageItem = {
  name: string;
  bytes: number;
  percentage: number;
};

export type FileItem = {
  path: string;
  type: "blob" | "tree";
  size?: number;
};

export type ScoreGroup = {
  codeQuality: number;
  security: number;
  documentation: number;
  testing: number;
  maintainability: number;
  overall: number;
};

export type AnalysisResult = {
  repo: RepoMeta;
  languages: LanguageItem[];
  files: FileItem[];
  readme: string | null;
  findings: Finding[];
  scores: ScoreGroup;
  stats: {
    totalFiles: number;
    sourceFiles: number;
    testFiles: number;
    dependencyFiles: string[];
    docsFiles: string[];
    todoCount: number;
    largeFiles: number;
    secretSignals: number;
  };
};
