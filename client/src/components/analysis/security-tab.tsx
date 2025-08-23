import { Issue, SecurityVulnerability } from "@/lib/analysis-types"

interface SecurityTabProps {
  securityIssues: Issue[]
  vulnerabilities: SecurityVulnerability[]
}

export function SecurityTab({ securityIssues, vulnerabilities }: SecurityTabProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-material-red text-white'
      case 'high':
        return 'bg-material-red text-white'
      case 'medium':
        return 'bg-material-orange text-white'
      case 'low':
        return 'bg-material-green/10 text-material-green'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-outline/20 rounded-lg p-6">
        <h3 className="font-medium mb-4">Security Issues</h3>
        <div className="space-y-4">
          {securityIssues.map((issue) => (
            <div key={issue.id} className="p-4 bg-material-red/5 border border-material-red/20 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="material-icon text-material-red">error</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{issue.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(issue.type)}`}>
                      {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-outline mt-1">{issue.file}</p>
                  <p className="text-sm mt-2">{issue.description}</p>
                  {issue.codeSnippet && (
                    <details className="mt-3">
                      <summary className="text-sm font-medium cursor-pointer text-material-blue">
                        View Code
                      </summary>
                      <pre className="mt-2 bg-gray-100 p-3 rounded text-xs font-roboto-mono overflow-x-auto">
                        <code>{issue.codeSnippet}</code>
                      </pre>
                    </details>
                  )}
                  {issue.recommendation && (
                    <div className="mt-3 p-3 bg-material-green/5 border border-material-green/20 rounded">
                      <p className="text-sm font-medium text-material-green">Recommendation:</p>
                      <p className="text-sm mt-1">{issue.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-outline/20 rounded-lg p-6">
        <h3 className="font-medium mb-4">Dependency Vulnerabilities</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="text-left py-2 px-3 font-medium text-sm">Package</th>
                <th className="text-left py-2 px-3 font-medium text-sm">Version</th>
                <th className="text-left py-2 px-3 font-medium text-sm">Severity</th>
                <th className="text-left py-2 px-3 font-medium text-sm">Fix Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/20">
              {vulnerabilities.map((vuln, index) => (
                <tr key={index} data-testid={`row-vulnerability-${index}`}>
                  <td className="py-2 px-3 font-mono text-sm">{vuln.package}</td>
                  <td className="py-2 px-3 text-sm">{vuln.version}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-sm">
                    {vuln.fixAvailable ? `✓ ${vuln.fixAvailable}` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
