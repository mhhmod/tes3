import { PerformanceMetrics } from "@/lib/analysis-types"
import { Card, CardContent } from "@/components/ui/card"

interface PerformanceTabProps {
  performance: PerformanceMetrics
}

export function PerformanceTab({ performance }: PerformanceTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Build Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Build Time</span>
                <span className="text-sm font-medium">{performance.buildTime}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-material-green h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Bundle Size</span>
                <span className="text-sm font-medium text-material-orange">{performance.bundleSize}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Chunks</span>
                <span className="text-sm font-medium">{performance.chunks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Runtime Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">First Contentful Paint</span>
                <span className="text-sm font-medium text-material-green">{performance.firstContentfulPaint}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Largest Contentful Paint</span>
                <span className="text-sm font-medium text-material-orange">{performance.largestContentfulPaint}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Time to Interactive</span>
                <span className="text-sm font-medium text-material-orange">{performance.timeToInteractive}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-white border border-outline/20">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Optimization Opportunities</h3>
            <div className="space-y-3">
              <div className="p-3 bg-material-orange/5 border border-material-orange/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="material-icon text-material-orange text-sm mt-0.5">image</span>
                  <div>
                    <h4 className="font-medium text-sm">Image Optimization</h4>
                    <p className="text-xs text-outline mt-1">Convert to WebP format (-45% size)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="material-icon text-blue-600 text-sm mt-0.5">code</span>
                  <div>
                    <h4 className="font-medium text-sm">Code Splitting</h4>
                    <p className="text-xs text-outline mt-1">Implement route-based splitting</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="material-icon text-blue-600 text-sm mt-0.5">cached</span>
                  <div>
                    <h4 className="font-medium text-sm">Lazy Loading</h4>
                    <p className="text-xs text-outline mt-1">Add lazy loading for non-critical components</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
