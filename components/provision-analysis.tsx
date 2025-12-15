import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface ProvisionData {
  provision: string
  comments: number
  avgSentiment: number
}

interface ProvisionAnalysisProps {
  data: ProvisionData[]
}

export function ProvisionAnalysis({ data }: ProvisionAnalysisProps) {
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return "text-secondary"
    if (sentiment < -0.3) return "text-destructive"
    return "text-muted-foreground"
  }

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.3) return "Positive"
    if (sentiment < -0.3) return "Negative"
    return "Neutral"
  }

  const getSentimentProgress = (sentiment: number) => {
    // Convert -1 to 1 scale to 0 to 100 scale
    return ((sentiment + 1) / 2) * 100
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provision Analysis</CardTitle>
        <CardDescription>Sentiment breakdown by legislative provision</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-balance">{item.provision}</p>
                <p className="text-xs text-muted-foreground">{item.comments} comments</p>
              </div>
              <Badge variant="outline" className={getSentimentColor(item.avgSentiment)}>
                {getSentimentLabel(item.avgSentiment)}
              </Badge>
            </div>
            <Progress value={getSentimentProgress(item.avgSentiment)} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
