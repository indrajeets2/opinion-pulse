"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, FileText, Table, CheckCircle } from "lucide-react"
import type { Comment } from "@/lib/mock-data"

interface ExportOptionsProps {
  filteredComments: Comment[]
  onExport: (format: "csv" | "pdf", options: ExportConfig) => void
}

interface ExportConfig {
  includeCharts: boolean
  includeWordCloud: boolean
  includeSummaries: boolean
  includeFullComments: boolean
  includeMetadata: boolean
  reportTitle: string
  reportDescription: string
}

export function ExportOptions({ filteredComments, onExport }: ExportOptionsProps) {
  const [config, setConfig] = useState<ExportConfig>({
    includeCharts: true,
    includeWordCloud: true,
    includeSummaries: true,
    includeFullComments: false,
    includeMetadata: true,
    reportTitle: "Stakeholder Feedback Analysis Report",
    reportDescription: "Comprehensive sentiment analysis of public consultation responses",
  })

  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState<string | null>(null)

  const updateConfig = (updates: Partial<ExportConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  const handleExport = async (format: "csv" | "pdf") => {
    setIsExporting(true)
    setExportComplete(null)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onExport(format, config)
    setIsExporting(false)
    setExportComplete(format.toUpperCase())

    // Clear success message after 3 seconds
    setTimeout(() => setExportComplete(null), 3000)
  }

  const estimatedFileSize = () => {
    let size = filteredComments.length * 0.5 // Base size per comment
    if (config.includeFullComments) size *= 3
    if (config.includeCharts) size += 2
    if (config.includeWordCloud) size += 1
    return size.toFixed(1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Options
        </CardTitle>
        <CardDescription>Configure your report export settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-title">Report Title</Label>
            <Input
              id="report-title"
              value={config.reportTitle}
              onChange={(e) => updateConfig({ reportTitle: e.target.value })}
              placeholder="Enter report title..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-description">Report Description</Label>
            <Textarea
              id="report-description"
              value={config.reportDescription}
              onChange={(e) => updateConfig({ reportDescription: e.target.value })}
              placeholder="Enter report description..."
              rows={2}
            />
          </div>
        </div>

        {/* Content Options */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Include in Report</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-charts"
                  checked={config.includeCharts}
                  onCheckedChange={(checked) => updateConfig({ includeCharts: !!checked })}
                />
                <Label htmlFor="include-charts" className="text-sm">
                  Sentiment charts and visualizations
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-wordcloud"
                  checked={config.includeWordCloud}
                  onCheckedChange={(checked) => updateConfig({ includeWordCloud: !!checked })}
                />
                <Label htmlFor="include-wordcloud" className="text-sm">
                  Word cloud and key topics
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-summaries"
                  checked={config.includeSummaries}
                  onCheckedChange={(checked) => updateConfig({ includeSummaries: !!checked })}
                />
                <Label htmlFor="include-summaries" className="text-sm">
                  AI-generated summaries
                </Label>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-full-comments"
                  checked={config.includeFullComments}
                  onCheckedChange={(checked) => updateConfig({ includeFullComments: !!checked })}
                />
                <Label htmlFor="include-full-comments" className="text-sm">
                  Full comment text
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-metadata"
                  checked={config.includeMetadata}
                  onCheckedChange={(checked) => updateConfig({ includeMetadata: !!checked })}
                />
                <Label htmlFor="include-metadata" className="text-sm">
                  Metadata and analysis details
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Comments to export:</span>
            <span className="font-medium">{filteredComments.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Estimated file size:</span>
            <span className="font-medium">{estimatedFileSize()} MB</span>
          </div>
        </div>

        {/* Export Success Message */}
        {exportComplete && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{exportComplete} report has been generated and downloaded successfully!</AlertDescription>
          </Alert>
        )}

        {/* Export Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            onClick={() => handleExport("csv")}
            disabled={isExporting || filteredComments.length === 0}
            className="flex-1"
          >
            <Table className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
          <Button
            onClick={() => handleExport("pdf")}
            disabled={isExporting || filteredComments.length === 0}
            variant="outline"
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>

        {filteredComments.length === 0 && (
          <Alert>
            <AlertDescription>
              No comments selected. Please adjust your filters to include comments for export.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
