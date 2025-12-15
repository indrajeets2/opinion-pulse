"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { SentimentChart } from "@/components/sentiment-chart"
import { WordCloud } from "@/components/word-cloud"
import { InsightCards } from "@/components/insight-cards"
import { ProvisionAnalysis } from "@/components/provision-analysis"
import { DashboardFilters } from "@/components/dashboard-filters"
import { SentimentOverview } from "@/components/sentiment-overview"
import { AISummary } from "@/components/ai-summary"
import { mockComments, topKeywords, provisionStats } from "@/lib/mock-data"

export default function HomePage() {
  const [filters, setFilters] = useState({
    sentiment: "all",
    stakeholderType: "all",
    dateRange: "all",
    provision: "all",
  })

  const filteredComments = mockComments.filter((comment) => {
    if (filters.sentiment !== "all" && comment.sentiment !== filters.sentiment) return false
    if (filters.stakeholderType !== "all" && comment.stakeholderType !== filters.stakeholderType) return false
    // Add more filtering logic as needed
    return true
  })

  const filteredStats = {
    positive: filteredComments.filter((c) => c.sentiment === "positive").length,
    negative: filteredComments.filter((c) => c.sentiment === "negative").length,
    neutral: filteredComments.filter((c) => c.sentiment === "neutral").length,
    total: filteredComments.length,
  }

  return (
    <AuthGuard>
      <Navigation />
      <div className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Overview of stakeholder feedback sentiment analysis</p>
          </div>

          <DashboardFilters onFiltersChange={setFilters} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SentimentOverview data={filteredStats} />
            </div>
            <div>
              <WordCloud keywords={topKeywords} />
            </div>
          </div>

          <AISummary comments={filteredComments} />

          <InsightCards comments={filteredComments} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SentimentChart data={filteredStats} />
            <ProvisionAnalysis data={provisionStats} />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
