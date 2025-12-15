"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WordCloudProps {
  keywords: Array<{ word: string; count: number }>
}

export function WordCloud({ keywords }: WordCloudProps) {
  const maxCount = Math.max(...keywords.map((k) => k.count))

  const getWordSize = (count: number) => {
    const ratio = count / maxCount
    if (ratio > 0.8) return "text-3xl"
    if (ratio > 0.6) return "text-2xl"
    if (ratio > 0.4) return "text-xl"
    if (ratio > 0.2) return "text-lg"
    return "text-base"
  }

  const getWordColor = (count: number) => {
    const ratio = count / maxCount
    if (ratio > 0.8) return "bg-primary text-primary-foreground"
    if (ratio > 0.6) return "bg-secondary text-secondary-foreground"
    if (ratio > 0.4) return "bg-accent text-accent-foreground"
    return "bg-muted text-muted-foreground"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Topics</CardTitle>
        <CardDescription>Most frequently mentioned keywords across all comments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 justify-center items-center min-h-[200px]">
          {keywords.map((keyword, index) => (
            <Badge
              key={keyword.word}
              variant="secondary"
              className={`${getWordSize(keyword.count)} ${getWordColor(keyword.count)} px-3 py-1 font-medium transition-all hover:scale-105 cursor-default`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {keyword.word}
              <span className="ml-1 text-xs opacity-75">({keyword.count})</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
