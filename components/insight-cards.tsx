import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Users } from "lucide-react"
import type { Comment } from "@/lib/mock-data"

interface InsightCardsProps {
  comments: Comment[]
}

export function InsightCards({ comments }: InsightCardsProps) {
  const flaggedComments = comments.filter((c) => c.flagged).length
  const stakeholderTypes = [...new Set(comments.map((c) => c.stakeholderType))].length
  const avgConfidence = ((comments.reduce((sum, c) => sum + c.confidence, 0) / comments.length) * 100).toFixed(1)

  const topConcerns = comments
    .filter((c) => c.sentiment === "negative" && c.flagged)
    .slice(0, 3)
    .map((c) => c.provision)

  const positiveHighlights = comments
    .filter((c) => c.sentiment === "positive" && c.confidence > 0.8)
    .slice(0, 3)
    .map((c) => c.provision)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{flaggedComments}</div>
          <p className="text-xs text-muted-foreground">Comments flagged for review</p>
          <div className="mt-3 space-y-1">
            {topConcerns.slice(0, 2).map((concern, index) => (
              <Badge key={index} variant="destructive" className="text-xs block w-fit">
                {concern}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Strong Support</CardTitle>
          <TrendingUp className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">
            {comments.filter((c) => c.sentiment === "positive").length}
          </div>
          <p className="text-xs text-muted-foreground">Positive responses</p>
          <div className="mt-3 space-y-1">
            {positiveHighlights.slice(0, 2).map((highlight, index) => (
              <Badge key={index} variant="secondary" className="text-xs block w-fit">
                {highlight}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Analysis Quality</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{avgConfidence}%</div>
          <p className="text-xs text-muted-foreground">Average confidence score</p>
          <div className="mt-3">
            <Badge variant="outline" className="text-xs">
              {stakeholderTypes} stakeholder types
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
