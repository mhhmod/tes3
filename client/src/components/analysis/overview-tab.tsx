import { Issue, AnalysisOverview } from "@/lib/analysis-types"
import { Card, CardContent } from "@/components/ui/card"

interface OverviewTabProps {
  overview: AnalysisOverview
  recentIssues: Issue[]
}

export function OverviewTab({ overview, recentIssues }: OverviewTabProps) {
  const getIssueIcon = (category: string) => {
    switch (category) {
      case 'security':
        return 'security'
      case 'performance':
        return 'memory'
      default:
        return 'speed'
    }
  }

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-material-red text-white'
      case 'warning':
        return 'bg-material-orange text-white'
      default:
        return 'bg-blue-600 text-white'
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Issue Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-material-red/5 rounded-lg border border-material-red/20">
              <div className="flex items-center gap-3">
                <span className="material-icon text-material-red">error</span>
                <span className="font-medium">Critical</span>
              </div>
              <span className="bg-material-red text-white px-2 py-1 rounded-full text-sm font-medium">
                3
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-material-orange/5 rounded-lg border border-material-orange/20">
              <div className="flex items-center gap-3">
                <span className="material-icon text-material-orange">warning</span>
                <span className="font-medium">Warning</span>
              </div>
              <span className="bg-material-orange text-white px-2 py-1 rounded-full text-sm font-medium">
                12
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <span className="material-icon text-blue-600">info</span>
                <span className="font-medium">Info</span>
              </div>
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                8
              </span>
            </div>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Critical Issues</h3>
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div 
                key={issue.id}
                className="p-4 border border-outline/20 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <span className={`material-icon text-sm mt-0.5 ${
                    issue.type === 'critical' ? 'text-material-red' :
                    issue.type === 'warning' ? 'text-material-orange' : 'text-blue-600'
                  }`}>
                    {getIssueIcon(issue.category)}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{issue.title}</h4>
                    <p className="text-sm text-outline mt-1">{issue.file}</p>
                    <p className="text-xs text-outline mt-1">{issue.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.type)}`}>
                    {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icon text-material-blue">code</span>
              <h3 className="font-medium">Code Quality</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">TypeScript Coverage</span>
                <span className="text-sm font-medium">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-material-green h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">ESLint Issues</span>
                <span className="text-sm font-medium text-material-orange">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Complexity Score</span>
                <span className="text-sm font-medium text-material-green">Good</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icon text-material-green">security</span>
              <h3 className="font-medium">Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Vulnerabilities</span>
                <span className="text-sm font-medium text-material-red">2 Critical</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Dependencies</span>
                <span className="text-sm font-medium text-material-green">Up to date</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">API Security</span>
                <span className="text-sm font-medium text-material-orange">Needs review</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icon text-material-orange">accessibility</span>
              <h3 className="font-medium">Accessibility</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">WCAG Compliance</span>
                <span className="text-sm font-medium text-material-green">AA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Contrast Ratio</span>
                <span className="text-sm font-medium text-material-green">4.8:1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Keyboard Navigation</span>
                <span className="text-sm font-medium text-material-orange">Partial</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
