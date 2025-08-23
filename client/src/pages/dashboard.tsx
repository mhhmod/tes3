import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TabsCustom, TabsListCustom, TabsTriggerCustom, TabsContentCustom } from "@/components/ui/tabs-custom"
import { OverviewTab } from "@/components/analysis/overview-tab"
import { ComponentsTab } from "@/components/analysis/components-tab"
import { PerformanceTab } from "@/components/analysis/performance-tab"
import { SecurityTab } from "@/components/analysis/security-tab"
import { AccessibilityTab } from "@/components/analysis/accessibility-tab"
import { DeploymentTab } from "@/components/analysis/deployment-tab"
import { AnalysisData } from "@/lib/analysis-types"

// Sample data - in a real app this would come from an API
const analysisData: AnalysisData = {
  overview: {
    overallScore: 87,
    scoreChange: 5,
    criticalIssues: 3,
    componentsAnalyzed: 47,
    performanceScore: 72,
    buildTime: "2.4s"
  },
  issues: [
    {
      id: "1",
      type: "critical",
      category: "security",
      title: "SQL Injection Risk",
      file: "server/routes.ts:45",
      description: "Unsanitized user input in query",
      recommendation: "Use parameterized queries or ORM methods to prevent SQL injection.",
      codeSnippet: `// Vulnerable code
app.get("/api/search", (req, res) => {
  const query = \`SELECT * FROM products WHERE name LIKE '%\${req.query.term}%'\`;
  db.execute(query);
});`
    },
    {
      id: "2",
      type: "critical",
      category: "performance",
      title: "Memory Leak Potential",
      file: "client/src/hooks/useCart.ts:23",
      description: "Event listeners not properly cleaned up",
      recommendation: "Ensure useEffect cleanup functions remove event listeners."
    },
    {
      id: "3",
      type: "warning",
      category: "performance",
      title: "Bundle Size Warning",
      file: "vite.config.ts",
      description: "Main bundle exceeds 500KB threshold",
      recommendation: "Implement code splitting and lazy loading."
    }
  ],
  components: [
    {
      name: "CheckoutModal.tsx",
      size: "4.2KB",
      complexity: "High",
      criticalIssues: 1,
      warningIssues: 3,
      infoIssues: 0,
      status: "Needs Review"
    },
    {
      name: "ProductCard.tsx",
      size: "2.1KB",
      complexity: "Medium",
      criticalIssues: 0,
      warningIssues: 2,
      infoIssues: 0,
      status: "Warning"
    },
    {
      name: "Header.tsx",
      size: "1.8KB",
      complexity: "Low",
      criticalIssues: 0,
      warningIssues: 0,
      infoIssues: 1,
      status: "Good"
    }
  ],
  performance: {
    buildTime: "2.4s",
    bundleSize: "524KB",
    chunks: 8,
    firstContentfulPaint: "1.2s",
    largestContentfulPaint: "2.8s",
    timeToInteractive: "3.1s"
  },
  security: {
    issues: [
      {
        id: "sec1",
        type: "critical",
        category: "security",
        title: "SQL Injection Risk",
        file: "server/routes.ts:45-52",
        description: "User input is directly concatenated into SQL query without sanitization.",
        recommendation: "Use parameterized queries or ORM methods to prevent SQL injection.",
        codeSnippet: `// Vulnerable code
app.get("/api/search", (req, res) => {
  const query = \`SELECT * FROM products WHERE name LIKE '%\${req.query.term}%'\`;
  db.execute(query);
});`
      },
      {
        id: "sec2",
        type: "critical",
        category: "security",
        title: "Missing CORS Configuration",
        file: "server/index.ts",
        description: "CORS is not properly configured, allowing requests from any origin.",
        recommendation: "Configure CORS with specific allowed origins and methods."
      }
    ],
    vulnerabilities: [
      {
        package: "express",
        version: "4.21.2",
        severity: "Low",
        fixAvailable: "4.21.3"
      },
      {
        package: "ws",
        version: "8.18.0",
        severity: "Low",
        fixAvailable: "8.18.2"
      }
    ]
  },
  accessibility: {
    score: {
      wcagCompliance: 92,
      perceivable: true,
      operable: false,
      understandable: true,
      robust: true,
      averageContrastRatio: "4.8:1"
    },
    issues: [
      {
        id: "a11y1",
        type: "warning",
        category: "accessibility",
        title: "Keyboard Navigation",
        file: "ProductCard.tsx",
        description: "ProductCard.tsx: Missing tab index on interactive elements"
      },
      {
        id: "a11y2",
        type: "info",
        category: "accessibility",
        title: "Alt Text Missing",
        file: "Multiple files",
        description: "3 images without descriptive alt text"
      },
      {
        id: "a11y3",
        type: "info",
        category: "accessibility",
        title: "Form Labels",
        file: "CheckoutModal.tsx",
        description: "CheckoutModal.tsx: Associate labels with form inputs"
      }
    ]
  },
  deployment: {
    staticBuild: true,
    clientSideRouting: true,
    apiEndpoints: false,
    environmentVariables: false
  }
}

export default function Dashboard() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-outline/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-material-blue rounded-lg flex items-center justify-center">
                <span className="material-icon text-white text-xl">code</span>
              </div>
              <div>
                <h1 className="text-xl font-medium text-on-surface">GrindCTRL Analysis</h1>
                <p className="text-sm text-outline">Code Quality & Performance Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                className="bg-material-blue text-white hover:bg-material-blue-light"
                data-testid="button-rescan"
              >
                <span className="material-icon text-sm mr-2">refresh</span>
                Re-scan
              </Button>
              <Button 
                variant="outline" 
                className="border-outline/40"
                data-testid="button-export"
              >
                <span className="material-icon text-sm mr-2">download</span>
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border border-outline/10" data-testid="card-overall-score">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-outline font-medium">Overall Score</p>
                  <p className="text-3xl font-bold text-material-green mt-1">{analysisData.overview.overallScore}</p>
                  <p className="text-sm text-material-green">+{analysisData.overview.scoreChange} from last scan</p>
                </div>
                <div className="w-12 h-12 bg-material-green/10 rounded-lg flex items-center justify-center">
                  <span className="material-icon text-material-green">trending_up</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-outline/10" data-testid="card-critical-issues">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-outline font-medium">Critical Issues</p>
                  <p className="text-3xl font-bold text-material-red mt-1">{analysisData.overview.criticalIssues}</p>
                  <p className="text-sm text-outline">2 Security, 1 Performance</p>
                </div>
                <div className="w-12 h-12 bg-material-red/10 rounded-lg flex items-center justify-center">
                  <span className="material-icon text-material-red">error</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-outline/10" data-testid="card-components">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-outline font-medium">Components Analyzed</p>
                  <p className="text-3xl font-bold text-on-surface mt-1">{analysisData.overview.componentsAnalyzed}</p>
                  <p className="text-sm text-outline">React & TypeScript</p>
                </div>
                <div className="w-12 h-12 bg-material-blue/10 rounded-lg flex items-center justify-center">
                  <span className="material-icon text-material-blue">widgets</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-outline/10" data-testid="card-performance">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-outline font-medium">Performance Score</p>
                  <p className="text-3xl font-bold text-material-orange mt-1">{analysisData.overview.performanceScore}</p>
                  <p className="text-sm text-outline">Build time: {analysisData.overview.buildTime}</p>
                </div>
                <div className="w-12 h-12 bg-material-orange/10 rounded-lg flex items-center justify-center">
                  <span className="material-icon text-material-orange">speed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="bg-white shadow-sm border border-outline/10">
          <TabsCustom defaultValue="overview" className="w-full">
            <div className="border-b border-outline/10">
              <TabsListCustom className="bg-transparent h-auto p-0 px-6">
                <TabsTriggerCustom value="overview" data-testid="tab-overview">Overview</TabsTriggerCustom>
                <TabsTriggerCustom value="components" data-testid="tab-components">Components</TabsTriggerCustom>
                <TabsTriggerCustom value="performance" data-testid="tab-performance">Performance</TabsTriggerCustom>
                <TabsTriggerCustom value="security" data-testid="tab-security">Security</TabsTriggerCustom>
                <TabsTriggerCustom value="accessibility" data-testid="tab-accessibility">Accessibility</TabsTriggerCustom>
                <TabsTriggerCustom value="deployment" data-testid="tab-deployment">Deployment</TabsTriggerCustom>
              </TabsListCustom>
            </div>

            <TabsContentCustom value="overview">
              <OverviewTab 
                overview={analysisData.overview} 
                recentIssues={analysisData.issues.slice(0, 3)} 
              />
            </TabsContentCustom>

            <TabsContentCustom value="components">
              <ComponentsTab components={analysisData.components} />
            </TabsContentCustom>

            <TabsContentCustom value="performance">
              <PerformanceTab performance={analysisData.performance} />
            </TabsContentCustom>

            <TabsContentCustom value="security">
              <SecurityTab 
                securityIssues={analysisData.security.issues}
                vulnerabilities={analysisData.security.vulnerabilities}
              />
            </TabsContentCustom>

            <TabsContentCustom value="accessibility">
              <AccessibilityTab 
                accessibilityScore={analysisData.accessibility.score}
                accessibilityIssues={analysisData.accessibility.issues}
              />
            </TabsContentCustom>

            <TabsContentCustom value="deployment">
              <DeploymentTab deployment={analysisData.deployment} />
            </TabsContentCustom>
          </TabsCustom>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end mt-6">
          <Button variant="outline" className="border-outline/40" data-testid="button-save-report">
            Save Report
          </Button>
          <Button className="bg-material-blue text-white hover:bg-material-blue-light" data-testid="button-generate-fixes">
            Generate Fixes
          </Button>
        </div>
      </main>
    </div>
  )
}
