"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SentimentChart } from "@/components/sentiment-chart"
import { WordCloud } from "@/components/word-cloud"
import { FileText, MessageSquare, TrendingUp } from "lucide-react"
import type { Comment } from "@/lib/mock-data"

interface ReportPreviewProps {
  filteredComments: Comment[]
  topKeywords: Array<{ word: string; count: number }>
}

export function ReportPreview({ filteredComments, topKeywords }: ReportPreviewProps) {
  const sentimentStats = {
    positive: filteredComments.filter((c) => c.sentiment === "positive").length,
    negative: filteredComments.filter((c) => c.sentiment === "negative").length,
    neutral: filteredComments.filter((c) => c.sentiment === "neutral").length,
    total: filteredComments.length,
  }

  const flaggedCount = filteredComments.filter((c) => c.flagged).length
  const avgConfidence = filteredComments.length
    ? (filteredComments.reduce((sum, c) => sum + c.confidence, 0) / filteredComments.length) * 100
    : 0

  const stakeholderBreakdown = filteredComments.reduce(
    (acc, comment) => {
      acc[comment.stakeholderType] = (acc[comment.stakeholderType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topConcerns = filteredComments
    .filter((c) => c.sentiment === "negative" && c.flagged)
    .slice(0, 3)
    .map((c) => c.provision)

  if (filteredComments.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No Comments Selected</p>
            <p className="text-sm text-muted-foreground">Adjust your filters to include comments in the report</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Preview
          </CardTitle>
          <CardDescription>Preview of your stakeholder feedback analysis report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{filteredComments.length}</div>
              <div className="text-xs text-muted-foreground">Total Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{flaggedCount}</div>
              <div className="text-xs text-muted-foreground">Critical Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{avgConfidence.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{Object.keys(stakeholderBreakdown).length}</div>
              <div className="text-xs text-muted-foreground">Stakeholder Types</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentChart data={sentimentStats} />
        <WordCloud keywords={topKeywords} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-4 w-4" />
              Stakeholder Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stakeholderBreakdown).map(([type, count]) => (
              <div key={type} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{type}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <Progress value={(count / filteredComments.length) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-4 w-4" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Top Concerns:</p>
              <div className="space-y-1">
                {topConcerns.length > 0 ? (
                  topConcerns.map((concern, index) => (
                    <Badge key={index} variant="destructive" className="text-xs block w-fit">
                      {concern}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No critical concerns identified</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Sentiment Distribution:</p>
              <div className="text-xs text-muted-foreground">
                {sentimentStats.positive > sentimentStats.negative
                  ? "Overall positive response to proposed legislation"
                  : sentimentStats.negative > sentimentStats.positive
                    ? "Significant concerns raised about proposed legislation"
                    : "Mixed response with balanced feedback"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
