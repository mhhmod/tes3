import { ComponentAnalysis } from "@/lib/analysis-types"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ComponentsTabProps {
  components: ComponentAnalysis[]
}

export function ComponentsTab({ components }: ComponentsTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good':
        return 'bg-material-green/10 text-material-green'
      case 'Warning':
        return 'bg-material-orange/10 text-material-orange'
      case 'Needs Review':
        return 'bg-material-red/10 text-material-red'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Component Analysis</h3>
        <div className="flex items-center gap-2">
          <Input 
            type="text" 
            placeholder="Filter components..." 
            className="w-48"
            data-testid="input-component-filter"
          />
          <Select>
            <SelectTrigger className="w-32" data-testid="select-issue-filter">
              <SelectValue placeholder="All Issues" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Issues</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Components Table */}
      <div className="bg-white border border-outline/20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-sm">Component</th>
              <th className="text-left py-3 px-4 font-medium text-sm">Size</th>
              <th className="text-left py-3 px-4 font-medium text-sm">Complexity</th>
              <th className="text-left py-3 px-4 font-medium text-sm">Issues</th>
              <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/20">
            {components.map((component, index) => (
              <tr key={index} className="hover:bg-surface/50" data-testid={`row-component-${index}`}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="material-icon text-sm text-outline">widgets</span>
                    <span className="font-mono text-sm">{component.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">{component.size}</td>
                <td className="py-3 px-4 text-sm">{component.complexity}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    {component.criticalIssues > 0 && (
                      <span className="bg-material-red text-white px-2 py-1 rounded text-xs">
                        {component.criticalIssues}
                      </span>
                    )}
                    {component.warningIssues > 0 && (
                      <span className="bg-material-orange text-white px-2 py-1 rounded text-xs">
                        {component.warningIssues}
                      </span>
                    )}
                    {component.infoIssues > 0 && (
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        {component.infoIssues}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(component.status)}`}>
                    {component.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
