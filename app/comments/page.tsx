"use client"

import { useState, useMemo } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { CommentCard } from "@/components/comment-card"
import { CommentDetailModal } from "@/components/comment-detail-modal"
import { CommentsSearch } from "@/components/comments-search"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { mockComments, type Comment } from "@/lib/mock-data"

const COMMENTS_PER_PAGE = 5

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    query: "",
    sentiment: "all",
    stakeholderType: "all",
    provision: "all",
    flagged: "all",
    sortBy: "date",
    sortOrder: "desc" as "asc" | "desc",
  })

  const filteredComments = useMemo(() => {
    const filtered = comments.filter((comment) => {
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase()
        const searchableText = [
          comment.text,
          comment.stakeholder,
          comment.provision,
          comment.summary,
          ...comment.keywords,
        ]
          .join(" ")
          .toLowerCase()
        if (!searchableText.includes(query)) return false
      }

      // Sentiment filter
      if (filters.sentiment !== "all" && comment.sentiment !== filters.sentiment) return false

      // Stakeholder type filter
      if (filters.stakeholderType !== "all" && comment.stakeholderType !== filters.stakeholderType) return false

      // Flagged filter
      if (filters.flagged === "flagged" && !comment.flagged) return false
      if (filters.flagged === "unflagged" && comment.flagged) return false

      return true
    })

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "sentiment":
          const sentimentOrder = { positive: 2, neutral: 1, negative: 0 }
          comparison = sentimentOrder[a.sentiment] - sentimentOrder[b.sentiment]
          break
        case "confidence":
          comparison = a.confidence - b.confidence
          break
        case "stakeholder":
          comparison = a.stakeholder.localeCompare(b.stakeholder)
          break
        default:
          comparison = 0
      }
      return filters.sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [comments, filters])

  const totalPages = Math.ceil(filteredComments.length / COMMENTS_PER_PAGE)
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE,
  )

  const handleUpdateComment = (id: string, updates: Partial<Comment>) => {
    setComments((prev) => prev.map((comment) => (comment.id === id ? { ...comment, ...updates } : comment)))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Reset to first page when filters change
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  return (
    <AuthGuard>
      <Navigation />
      <div className="md:ml-64 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Comments Explorer</h1>
            <p className="text-muted-foreground mt-2">Search, filter, and manage stakeholder feedback</p>
          </div>

          <CommentsSearch onFiltersChange={handleFiltersChange} totalResults={filteredComments.length} />

          <div className="space-y-4">
            {paginatedComments.length > 0 ? (
              paginatedComments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onUpdate={handleUpdateComment}
                  onViewDetail={setSelectedComment}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No comments match your current filters.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() =>
                    handleFiltersChange({
                      query: "",
                      sentiment: "all",
                      stakeholderType: "all",
                      provision: "all",
                      flagged: "all",
                      sortBy: "date",
                      sortOrder: "desc",
                    })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CommentDetailModal
        comment={selectedComment}
        isOpen={!!selectedComment}
        onClose={() => setSelectedComment(null)}
      />
    </AuthGuard>
  )
}
