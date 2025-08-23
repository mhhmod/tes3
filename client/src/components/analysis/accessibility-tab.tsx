import { AccessibilityScore, Issue } from "@/lib/analysis-types"
import { Card, CardContent } from "@/components/ui/card"

interface AccessibilityTabProps {
  accessibilityScore: AccessibilityScore
  accessibilityIssues: Issue[]
}

export function AccessibilityTab({ accessibilityScore, accessibilityIssues }: AccessibilityTabProps) {
  const getComplianceIcon = (isCompliant: boolean) => {
    return isCompliant ? '✓' : '⚠'
  }

  const getComplianceColor = (isCompliant: boolean) => {
    return isCompliant ? 'text-material-green' : 'text-material-orange'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">WCAG Compliance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Level AA Compliance</span>
                <span className="bg-material-green/10 text-material-green px-2 py-1 rounded text-xs">
                  {accessibilityScore.wcagCompliance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-material-green h-2 rounded-full" 
                  style={{ width: `${accessibilityScore.wcagCompliance}%` }}
                ></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Perceivable</span>
                  <span className={getComplianceColor(accessibilityScore.perceivable)}>
                    {getComplianceIcon(accessibilityScore.perceivable)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Operable</span>
                  <span className={getComplianceColor(accessibilityScore.operable)}>
                    {getComplianceIcon(accessibilityScore.operable)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Understandable</span>
                  <span className={getComplianceColor(accessibilityScore.understandable)}>
                    {getComplianceIcon(accessibilityScore.understandable)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Robust</span>
                  <span className={getComplianceColor(accessibilityScore.robust)}>
                    {getComplianceIcon(accessibilityScore.robust)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Color Contrast</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Ratio</span>
                <span className="text-sm font-medium text-material-green">
                  {accessibilityScore.averageContrastRatio}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border border-outline/20 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-on-surface rounded"></div>
                    <span className="text-sm">Primary text</span>
                  </div>
                  <span className="text-sm text-material-green">7.2:1</span>
                </div>
                <div className="flex items-center justify-between p-2 border border-outline/20 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-outline rounded"></div>
                    <span className="text-sm">Secondary text</span>
                  </div>
                  <span className="text-sm text-material-green">4.5:1</span>
                </div>
                <div className="flex items-center justify-between p-2 border border-material-orange/20 bg-material-orange/5 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-material-blue rounded"></div>
                    <span className="text-sm">Primary button</span>
                  </div>
                  <span className="text-sm text-material-orange">3.8:1</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Accessibility Issues</h3>
            <div className="space-y-3">
              {accessibilityIssues.map((issue) => (
                <div key={issue.id} className="p-3 bg-material-orange/5 border border-material-orange/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="material-icon text-material-orange text-sm">
                      {issue.category === 'accessibility' ? 'keyboard' : 'accessibility'}
                    </span>
                    <div>
                      <h4 className="font-medium text-sm">{issue.title}</h4>
                      <p className="text-xs text-outline mt-1">{issue.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Screen Reader Test</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Semantic HTML</span>
                <span className="text-material-green">✓ Good</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">ARIA Labels</span>
                <span className="text-material-orange">⚠ Partial</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Focus Management</span>
                <span className="text-material-orange">⚠ Needs work</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Live Regions</span>
                <span className="text-material-red">✗ Missing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
