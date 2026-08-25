export type Severity =
  | 'CRITICAL'
  | 'ERROR'
  | 'WARNING'
  | 'SUGGESTION'
  | 'INFO';

/**
 * Backward-compatible alias used by History.tsx
 */
export type IssueSeverity = Severity;

/**
 * History filtering options
 */
export type ReviewFilter =
  | 'all'
  | 'critical'
  | 'error'
  | 'warning'
  | 'suggestion'
  | 'info';

/**
 * History sorting options
 */
export type SortOrder =
  | 'newest'
  | 'oldest'
  | 'highest'
  | 'lowest';

export interface CodeIssue {
  id: string;
  codeSnippet?: string;

  severity: Severity;

  title: string;

  file: string;

  line: number;

  description: string;

  whyItMatters: string;

  suggestedFix: string;

  originalCode?: string;

  suggestedCode?: string;
}

export interface ReviewScoreBreakdown {
  security: number;

  performance: number;

  maintainability: number;

  readability: number;

  bestPractices: number;
}

export interface ReviewRecord {
  id: string;

  projectId?: string;

  projectName: string;

  repository?: string;

  branch?: string;

  /**
   * Optional commit hash used by History
   */
  commitHash?: string;

  language: string;

  overallScore: number;

  scores: ReviewScoreBreakdown;

  issues: CodeIssue[];

  filesReviewedCount: number;

  status: 'Completed' | 'Analyzing' | 'Failed';

  createdAt: string;

  summary?: string;

  suggestions?: string[];

  improvedCode?: string;
}

export interface Project {
  id: string;

  name: string;

  description: string;

  repository: string;

  branch: string;

  language: string;

  reviewsCount: number;

  lastReviewed: string;

  score: number;

  status:
    | 'Healthy'
    | 'Needs Attention'
    | 'Critical Issues';

  /**
   * Dashboard statistics.
   * Optional because these values may not exist
   * in every project returned by the backend.
   */
  criticalIssues?: number;

  fixedIssues?: number;

  createdAt: string;
}

export interface User {
  id: string;

  name: string;

  email: string;

  avatar?: string;

  createdAt?: string;
}

export interface GitHubRepo {
  id: number;

  name: string;

  full_name: string;

  description: string;

  language: string;

  stars: number;

  forks: number;

  updated_at: string;

  default_branch: string;
}

export interface GitHubUser {
  connected: boolean;

  /**
   * GitHub API username/login
   */
  login?: string;

  /**
   * Application-level username
   */
  username: string;

  avatar: string;

  repositoriesCount: number;

  connectedAt: string;
}

export interface FileItem {
  id: string;

  name: string;

  path: string;

  type: 'file' | 'folder';

  language?: string;

  content?: string;

  children?: FileItem[];

  isOpened?: boolean;

  isModified?: boolean;
}