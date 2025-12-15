"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, FileText, Target, TrendingUp } from "lucide-react"
import type { Comment } from "@/lib/mock-data"

interface CommentDetailModalProps {
  comment: Comment | null
  isOpen: boolean
  onClose: () => void
}

export function CommentDetailModal({ comment, isOpen, onClose }: CommentDetailModalProps) {
  if (!comment) return null

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "sentiment-positive"
      case "negative":
        return "sentiment-negative"
      default:
        return "sentiment-neutral"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Comment Details
          </DialogTitle>
          <DialogDescription>Full comment analysis and metadata</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{comment.stakeholder}</span>
                  <Badge variant="secondary">{comment.stakeholderType}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(comment.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Provision:</span>
                </div>
                <p className="text-sm text-balance">{comment.provision}</p>
              </div>
            </div>

            <Separator />

            {/* Sentiment Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Sentiment Analysis</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={`${getSentimentColor(comment.sentiment)}`}>
                  {comment.sentiment.charAt(0).toUpperCase() + comment.sentiment.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Confidence: {Math.round(comment.confidence * 100)}%
                </span>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">AI Summary:</p>
                <p className="text-sm text-balance">{comment.summary}</p>
              </div>
            </div>

            <Separator />

            {/* Keywords */}
            <div className="space-y-3">
              <span className="font-medium">Key Topics:</span>
              <div className="flex flex-wrap gap-2">
                {comment.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Full Comment Text */}
            <div className="space-y-3">
              <span className="font-medium">Full Comment:</span>
              <div className="bg-card border rounded-lg p-4">
                <p className="text-sm leading-relaxed text-balance">{comment.text}</p>
              </div>
            </div>

            {/* Notes */}
            {comment.notes && (
              <>
                <Separator />
                <div className="space-y-3">
                  <span className="font-medium">Review Notes:</span>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm text-balance">{comment.notes}</p>
                  </div>
                </div>
              </>
            )}

            {/* Status */}
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant={comment.flagged ? "destructive" : "secondary"}>
                  {comment.flagged ? "Flagged for Review" : "No Issues"}
                </Badge>
                <Badge variant={comment.includeInReport ? "default" : "outline"}>
                  {comment.includeInReport ? "Included in Report" : "Excluded from Report"}
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
