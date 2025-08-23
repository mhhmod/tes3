import { DeploymentCompatibility } from "@/lib/analysis-types"
import { Card, CardContent } from "@/components/ui/card"

interface DeploymentTabProps {
  deployment: DeploymentCompatibility
}

export function DeploymentTab({ deployment }: DeploymentTabProps) {
  const getCompatibilityStatus = (isCompatible: boolean, label: string) => {
    const bgColor = isCompatible ? 'bg-material-green/5 border-material-green/20' : 'bg-material-red/5 border-material-red/20'
    const iconColor = isCompatible ? 'text-material-green' : 'text-material-red'
    const icon = isCompatible ? 'check_circle' : 'error'
    const statusText = isCompatible ? 'Compatible' : (label === 'API Endpoints' ? 'Requires Backend' : label === 'Environment Variables' ? 'Not Set' : 'Incompatible')
    const statusColor = isCompatible ? 'text-material-green' : (label === 'API Endpoints' ? 'text-material-orange' : 'text-material-red')

    return { bgColor, iconColor, icon, statusText, statusColor }
  }

  const staticBuildStatus = getCompatibilityStatus(deployment.staticBuild, 'Static Build')
  const routingStatus = getCompatibilityStatus(deployment.clientSideRouting, 'Client-side Routing')
  const apiStatus = getCompatibilityStatus(deployment.apiEndpoints, 'API Endpoints')
  const envStatus = getCompatibilityStatus(deployment.environmentVariables, 'Environment Variables')

  return (
    <div className="space-y-6">
      <div className="bg-white border border-outline/20 rounded-lg p-6">
        <h3 className="font-medium mb-4">GitHub Pages Compatibility</h3>
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-3 ${staticBuildStatus.bgColor} rounded-lg`}>
            <div className="flex items-center gap-3">
              <span className={`material-icon ${staticBuildStatus.iconColor}`}>{staticBuildStatus.icon}</span>
              <span className="font-medium">Static Build Output</span>
            </div>
            <span className={`text-sm ${staticBuildStatus.statusColor}`}>{staticBuildStatus.statusText}</span>
          </div>
          
          <div className={`flex items-center justify-between p-3 ${routingStatus.bgColor} rounded-lg`}>
            <div className="flex items-center gap-3">
              <span className={`material-icon ${routingStatus.iconColor}`}>{routingStatus.icon}</span>
              <span className="font-medium">Client-side Routing</span>
            </div>
            <span className={`text-sm ${routingStatus.statusColor}`}>{routingStatus.statusText}</span>
          </div>
          
          <div className={`flex items-center justify-between p-3 ${apiStatus.bgColor} rounded-lg`}>
            <div className="flex items-center gap-3">
              <span className={`material-icon ${apiStatus.iconColor}`}>{apiStatus.icon}</span>
              <span className="font-medium">API Endpoints</span>
            </div>
            <span className={`text-sm ${apiStatus.statusColor}`}>{apiStatus.statusText}</span>
          </div>
          
          <div className={`flex items-center justify-between p-3 ${envStatus.bgColor} rounded-lg`}>
            <div className="flex items-center gap-3">
              <span className={`material-icon ${envStatus.iconColor}`}>{envStatus.icon}</span>
              <span className="font-medium">Environment Variables</span>
            </div>
            <span className={`text-sm ${envStatus.statusColor}`}>{envStatus.statusText}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Build Configuration</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Output Directory</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">dist/public</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Base Path</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">/</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Asset Optimization</span>
                <span className="text-material-green">✓ Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tree Shaking</span>
                <span className="text-material-green">✓ Enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Recommendations</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-sm">Add 404.html</h4>
                <p className="text-xs text-outline mt-1">For SPA routing support</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-sm">Configure Redirects</h4>
                <p className="text-xs text-outline mt-1">Handle API calls in production</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-sm">Environment Setup</h4>
                <p className="text-xs text-outline mt-1">Add production environment variables</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
