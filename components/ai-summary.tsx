"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, RefreshCw, Download } from "lucide-react"
import { useState } from "react"

interface AISummaryProps {
  comments: any[]
}

export function AISummary({ comments }: AISummaryProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState({
    keyThemes: [
      "Privacy concerns regarding data collection",
      "Support for increased transparency measures",
      "Questions about implementation timeline",
      "Cost-benefit analysis requests",
    ],
    mainConcerns: ["Data protection and privacy rights", "Implementation costs and funding", "Enforcement mechanisms"],
    recommendations: [
      "Address privacy concerns with clearer data protection clauses",
      "Provide detailed implementation timeline",
      "Include cost-benefit analysis in final proposal",
    ],
    confidence: 87,
  })

  const regenerateSummary = async () => {
    setIsGenerating(true)
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Brain className="h-5 w-5" />
            AI-Generated Summary
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              {summary.confidence}% Confidence
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={regenerateSummary}
              disabled={isGenerating}
              className="border-blue-200 text-blue-700 hover:bg-blue-100 bg-transparent"
            >
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Key Themes</h4>
          <div className="flex flex-wrap gap-2">
            {summary.keyThemes.map((theme, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                {theme}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Main Concerns</h4>
          <ul className="space-y-1">
            {summary.mainConcerns.map((concern, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                {concern}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
          <ul className="space-y-1">
            {summary.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export Full Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
