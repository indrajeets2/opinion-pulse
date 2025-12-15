"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, SortAsc, SortDesc } from "lucide-react"

interface SearchFilters {
  query: string
  sentiment: string
  stakeholderType: string
  provision: string
  flagged: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface CommentsSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  totalResults: number
}

export function CommentsSearch({ onFiltersChange, totalResults }: CommentsSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    sentiment: "all",
    stakeholderType: "all",
    provision: "all",
    flagged: "all",
    sortBy: "date",
    sortOrder: "desc",
  })

  const updateFilter = (key: keyof SearchFilters, value: string | "asc" | "desc") => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: "",
      sentiment: "all",
      stakeholderType: "all",
      provision: "all",
      flagged: "all",
      sortBy: "date",
      sortOrder: "desc",
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "query") return value !== ""
    if (key === "sortBy" || key === "sortOrder") return false
    return value !== "all"
  }).length

  const toggleSortOrder = () => {
    updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search comments, stakeholders, or provisions..."
            value={filters.query}
            onChange={(e) => updateFilter("query", e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="sentiment">Sentiment</SelectItem>
              <SelectItem value="confidence">Confidence</SelectItem>
              <SelectItem value="stakeholder">Stakeholder</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={toggleSortOrder}>
            {filters.sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={filters.sentiment} onValueChange={(value) => updateFilter("sentiment", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.stakeholderType} onValueChange={(value) => updateFilter("stakeholderType", value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Stakeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Individual">Individual</SelectItem>
            <SelectItem value="Organization">Organization</SelectItem>
            <SelectItem value="Government">Government</SelectItem>
            <SelectItem value="NGO">NGO</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.flagged} onValueChange={(value) => updateFilter("flagged", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="unflagged">Not Flagged</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
            </Badge>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-3 w-3" />
              Clear
            </Button>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {totalResults} comment{totalResults !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
