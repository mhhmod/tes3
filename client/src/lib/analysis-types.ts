export interface AnalysisOverview {
  overallScore: number;
  scoreChange: number;
  criticalIssues: number;
  componentsAnalyzed: number;
  performanceScore: number;
  buildTime: string;
}

export interface Issue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'security' | 'performance' | 'accessibility' | 'code-quality';
  title: string;
  file: string;
  line?: number;
  description: string;
  recommendation?: string;
  codeSnippet?: string;
}

export interface ComponentAnalysis {
  name: string;
  size: string;
  complexity: 'Low' | 'Medium' | 'High';
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  status: 'Good' | 'Warning' | 'Needs Review';
}

export interface PerformanceMetrics {
  buildTime: string;
  bundleSize: string;
  chunks: number;
  firstContentfulPaint: string;
  largestContentfulPaint: string;
  timeToInteractive: string;
}

export interface SecurityVulnerability {
  package: string;
  version: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  fixAvailable: string | null;
}

export interface AccessibilityScore {
  wcagCompliance: number;
  perceivable: boolean;
  operable: boolean;
  understandable: boolean;
  robust: boolean;
  averageContrastRatio: string;
}

export interface DeploymentCompatibility {
  staticBuild: boolean;
  clientSideRouting: boolean;
  apiEndpoints: boolean;
  environmentVariables: boolean;
}

export interface AnalysisData {
  overview: AnalysisOverview;
  issues: Issue[];
  components: ComponentAnalysis[];
  performance: PerformanceMetrics;
  security: {
    issues: Issue[];
    vulnerabilities: SecurityVulnerability[];
  };
  accessibility: {
    score: AccessibilityScore;
    issues: Issue[];
  };
  deployment: DeploymentCompatibility;
}
