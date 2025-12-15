"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, Flag, MessageSquare, Calendar, User, Edit3, Save, X } from "lucide-react"
import type { Comment } from "@/lib/mock-data"

interface CommentCardProps {
  comment: Comment
  onUpdate: (id: string, updates: Partial<Comment>) => void
  onViewDetail: (comment: Comment) => void
}

export function CommentCard({ comment, onUpdate, onViewDetail }: CommentCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(comment.notes)

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

  const handleSaveNotes = () => {
    onUpdate(comment.id, { notes })
    setIsEditingNotes(false)
  }

  const handleCancelNotes = () => {
    setNotes(comment.notes)
    setIsEditingNotes(false)
  }

  const handleToggleFlag = () => {
    onUpdate(comment.id, { flagged: !comment.flagged })
  }

  const handleToggleReport = () => {
    onUpdate(comment.id, { includeInReport: !comment.includeInReport })
  }

  return (
    <Card className={`transition-all hover:shadow-md ${comment.flagged ? "border-destructive/50" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                {comment.stakeholder}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {comment.stakeholderType}
              </Badge>
              {comment.flagged && (
                <Badge variant="destructive" className="text-xs">
                  <Flag className="h-3 w-3 mr-1" />
                  Flagged
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium text-balance mb-1">{comment.provision}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(comment.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {comment.text.length} chars
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getSentimentColor(comment.sentiment)} text-xs`}>
              {comment.sentiment} ({Math.round(comment.confidence * 100)}%)
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">AI Summary:</p>
          <p className="text-sm text-balance">{comment.summary}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {comment.keywords.map((keyword, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`notes-${comment.id}`} className="text-xs font-medium">
              Notes:
            </Label>
            {!isEditingNotes ? (
              <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(true)}>
                <Edit3 className="h-3 w-3" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={handleSaveNotes}>
                  <Save className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancelNotes}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          {isEditingNotes ? (
            <Textarea
              id={`notes-${comment.id}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this comment..."
              className="text-xs"
              rows={2}
            />
          ) : (
            <p className="text-xs text-muted-foreground min-h-[2rem] p-2 bg-muted/30 rounded">
              {comment.notes || "No notes added"}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id={`flag-${comment.id}`}
                checked={comment.flagged}
                onCheckedChange={handleToggleFlag}
                size="sm"
              />
              <Label htmlFor={`flag-${comment.id}`} className="text-xs">
                Flag for review
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id={`report-${comment.id}`}
                checked={comment.includeInReport}
                onCheckedChange={handleToggleReport}
                size="sm"
              />
              <Label htmlFor={`report-${comment.id}`} className="text-xs">
                Include in report
              </Label>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onViewDetail(comment)}>
            <Eye className="h-3 w-3 mr-1" />
            View Full
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
