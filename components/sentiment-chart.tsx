"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SentimentData {
  name: string
  value: number
  color: string
}

interface SentimentChartProps {
  data: {
    positive: number
    negative: number
    neutral: number
    total: number
  }
}

export function SentimentChart({ data }: SentimentChartProps) {
  const chartData: SentimentData[] = [
    {
      name: "Positive",
      value: data.positive,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "Negative",
      value: data.negative,
      color: "hsl(var(--chart-2))",
    },
    {
      name: "Neutral",
      value: data.neutral,
      color: "hsl(var(--chart-3))",
    },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / data.payload.total) * 100).toFixed(1)
      return (
        <div className="bg-popover border rounded-lg p-2 shadow-md">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} comments ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Distribution</CardTitle>
        <CardDescription>Overall sentiment analysis of {data.total} stakeholder comments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {chartData.map((item) => (
            <div key={item.name} className="text-center">
              <div className="text-2xl font-bold" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground">{item.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
