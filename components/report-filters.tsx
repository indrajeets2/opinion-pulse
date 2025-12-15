"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"

interface ReportFilters {
  sentiment: string[]
  stakeholderType: string[]
  dateRange: { from: Date | null; to: Date | null }
  includeOnlyFlagged: boolean
  includeOnlyReportReady: boolean
  provisions: string[]
}

interface ReportFiltersProps {
  onFiltersChange: (filters: ReportFilters) => void
  availableProvisions: string[]
}

export function ReportFilters({ onFiltersChange, availableProvisions }: ReportFiltersProps) {
  const [filters, setFilters] = useState<ReportFilters>({
    sentiment: ["positive", "negative", "neutral"],
    stakeholderType: ["Individual", "Organization", "Government", "NGO"],
    dateRange: { from: null, to: null },
    includeOnlyFlagged: false,
    includeOnlyReportReady: true,
    provisions: [],
  })

  const updateFilters = (updates: Partial<ReportFilters>) => {
    const newFilters = { ...filters, ...updates }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleSentiment = (sentiment: string) => {
    const newSentiment = filters.sentiment.includes(sentiment)
      ? filters.sentiment.filter((s) => s !== sentiment)
      : [...filters.sentiment, sentiment]
    updateFilters({ sentiment: newSentiment })
  }

  const toggleStakeholderType = (type: string) => {
    const newTypes = filters.stakeholderType.includes(type)
      ? filters.stakeholderType.filter((t) => t !== type)
      : [...filters.stakeholderType, type]
    updateFilters({ stakeholderType: newTypes })
  }

  const toggleProvision = (provision: string) => {
    const newProvisions = filters.provisions.includes(provision)
      ? filters.provisions.filter((p) => p !== provision)
      : [...filters.provisions, provision]
    updateFilters({ provisions: newProvisions })
  }

  const clearAllFilters = () => {
    const clearedFilters: ReportFilters = {
      sentiment: ["positive", "negative", "neutral"],
      stakeholderType: ["Individual", "Organization", "Government", "NGO"],
      dateRange: { from: null, to: null },
      includeOnlyFlagged: false,
      includeOnlyReportReady: true,
      provisions: [],
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount =
    (filters.sentiment.length < 3 ? 1 : 0) +
    (filters.stakeholderType.length < 4 ? 1 : 0) +
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
    (filters.includeOnlyFlagged ? 1 : 0) +
    (filters.provisions.length > 0 ? 1 : 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Report Filters
        </CardTitle>
        <CardDescription>Configure which comments to include in your report</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sentiment Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sentiment</Label>
            <div className="space-y-2">
              {["positive", "negative", "neutral"].map((sentiment) => (
                <div key={sentiment} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sentiment-${sentiment}`}
                    checked={filters.sentiment.includes(sentiment)}
                    onCheckedChange={() => toggleSentiment(sentiment)}
                  />
                  <Label htmlFor={`sentiment-${sentiment}`} className="text-sm capitalize">
                    {sentiment}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholder Type Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Stakeholder Types</Label>
            <div className="space-y-2">
              {["Individual", "Organization", "Government", "NGO"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.stakeholderType.includes(type)}
                    onCheckedChange={() => toggleStakeholderType(type)}
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Date Range</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[140px] justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? format(filters.dateRange.from, "MMM dd") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from || undefined}
                  onSelect={(date) => updateFilters({ dateRange: { ...filters.dateRange, from: date || null } })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-sm text-muted-foreground">to</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[140px] justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.to ? format(filters.dateRange.to, "MMM dd") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to || undefined}
                  onSelect={(date) => updateFilters({ dateRange: { ...filters.dateRange, to: date || null } })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Special Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Special Filters</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="flagged-only"
                checked={filters.includeOnlyFlagged}
                onCheckedChange={(checked) => updateFilters({ includeOnlyFlagged: !!checked })}
              />
              <Label htmlFor="flagged-only" className="text-sm">
                Include only flagged comments
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="report-ready"
                checked={filters.includeOnlyReportReady}
                onCheckedChange={(checked) => updateFilters({ includeOnlyReportReady: !!checked })}
              />
              <Label htmlFor="report-ready" className="text-sm">
                Include only comments marked for reports
              </Label>
            </div>
          </div>
        </div>

        {/* Provisions Filter */}
        {availableProvisions.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Specific Provisions (Optional)</Label>
            <div className="flex flex-wrap gap-2">
              {availableProvisions.slice(0, 6).map((provision) => (
                <Badge
                  key={provision}
                  variant={filters.provisions.includes(provision) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleProvision(provision)}
                >
                  {provision}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
