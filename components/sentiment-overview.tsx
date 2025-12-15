"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Users } from "lucide-react"

interface SentimentOverviewProps {
  data: {
    positive: number
    negative: number
    neutral: number
    total: number
  }
}

export function SentimentOverview({ data }: SentimentOverviewProps) {
  const positivePercentage = Math.round((data.positive / data.total) * 100)
  const negativePercentage = Math.round((data.negative / data.total) * 100)
  const neutralPercentage = Math.round((data.neutral / data.total) * 100)

  const overallSentiment =
    positivePercentage > negativePercentage
      ? "positive"
      : negativePercentage > positivePercentage
        ? "negative"
        : "neutral"

  return (
    <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-teal-800">
          <Users className="h-5 w-5" />
          Sentiment Analysis Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{data.total}</div>
            <div className="text-sm text-gray-600">Total Comments</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{positivePercentage}%</span>
            </div>
            <div className="text-sm text-gray-600">Positive</div>
            <Badge variant="outline" className="text-xs mt-1 border-green-200 text-green-700">
              {data.positive} comments
            </Badge>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{negativePercentage}%</span>
            </div>
            <div className="text-sm text-gray-600">Negative</div>
            <Badge variant="outline" className="text-xs mt-1 border-red-200 text-red-700">
              {data.negative} comments
            </Badge>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Minus className="h-4 w-4 text-gray-600" />
              <span className="text-2xl font-bold text-gray-600">{neutralPercentage}%</span>
            </div>
            <div className="text-sm text-gray-600">Neutral</div>
            <Badge variant="outline" className="text-xs mt-1 border-gray-200 text-gray-700">
              {data.neutral} comments
            </Badge>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                overallSentiment === "positive"
                  ? "bg-green-500"
                  : overallSentiment === "negative"
                    ? "bg-red-500"
                    : "bg-gray-500"
              }`}
            />
            <span className="text-sm font-medium">
              Overall Sentiment:{" "}
              <span
                className={`capitalize ${
                  overallSentiment === "positive"
                    ? "text-green-700"
                    : overallSentiment === "negative"
                      ? "text-red-700"
                      : "text-gray-700"
                }`}
              >
                {overallSentiment}
              </span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
