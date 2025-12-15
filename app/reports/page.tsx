"use client"

import { useState, useMemo } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { ReportFilters as ReportFiltersComponent } from "@/components/report-filters"
import { ReportPreview } from "@/components/report-preview"
import { ExportOptions } from "@/components/export-options"
import { mockComments, topKeywords } from "@/lib/mock-data"

interface ReportFilters {
  sentiment: string[]
  stakeholderType: string[]
  dateRange: { from: Date | null; to: Date | null }
  includeOnlyFlagged: boolean
  includeOnlyReportReady: boolean
  provisions: string[]
}

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    sentiment: ["positive", "negative", "neutral"],
    stakeholderType: ["Individual", "Organization", "Government", "NGO"],
    dateRange: { from: null, to: null },
    includeOnlyFlagged: false,
    includeOnlyReportReady: true,
    provisions: [],
  })

  const availableProvisions = [...new Set(mockComments.map((c) => c.provision))]

  const filteredComments = useMemo(() => {
    return mockComments.filter((comment) => {
      // Sentiment filter
      if (!filters.sentiment.includes(comment.sentiment)) return false

      // Stakeholder type filter
      if (!filters.stakeholderType.includes(comment.stakeholderType)) return false

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const commentDate = new Date(comment.date)
        if (filters.dateRange.from && commentDate < filters.dateRange.from) return false
        if (filters.dateRange.to && commentDate > filters.dateRange.to) return false
      }

      // Flagged filter
      if (filters.includeOnlyFlagged && !comment.flagged) return false

      // Report ready filter
      if (filters.includeOnlyReportReady && !comment.includeInReport) return false

      // Provisions filter
      if (filters.provisions.length > 0 && !filters.provisions.includes(comment.provision)) return false

      return true
    })
  }, [filters])

  const handleExport = (format: "csv" | "pdf", options: any) => {
    // In a real application, this would trigger the actual export
    console.log(`Exporting ${format.toUpperCase()} with options:`, options)
    console.log(`Filtered comments:`, filteredComments.length)

    // Simulate file download
    const filename = `stakeholder-feedback-report.${format}`
    const element = document.createElement("a")
    const file = new Blob([`Mock ${format.toUpperCase()} export data`], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <AuthGuard>
      <Navigation />
      <div className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Reports & Export</h1>
            <p className="text-muted-foreground mt-2">
              Generate comprehensive analysis reports for stakeholder feedback
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-6">
              <ReportFiltersComponent onFiltersChange={setFilters} availableProvisions={availableProvisions} />
              <ExportOptions filteredComments={filteredComments} onExport={handleExport} />
            </div>

            <div className="xl:col-span-2">
              <ReportPreview filteredComments={filteredComments} topKeywords={topKeywords} />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
