"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Settings, CheckCircle, AlertCircle } from "lucide-react"

interface ColumnMappingProps {
  csvHeaders: string[]
  onMappingComplete: (mapping: Record<string, string>) => void
  isProcessing: boolean
}

const requiredFields = [
  { key: "stakeholder", label: "Stakeholder Name", required: true },
  { key: "text", label: "Comment Text", required: true },
  { key: "date", label: "Date", required: true },
]

const optionalFields = [
  { key: "stakeholderType", label: "Stakeholder Type", required: false },
  { key: "provision", label: "Provision/Section", required: false },
  { key: "email", label: "Email Address", required: false },
]

export function ColumnMapping({ csvHeaders, onMappingComplete, isProcessing }: ColumnMappingProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<string[]>([])

  // Auto-detect common column mappings
  useEffect(() => {
    const autoMapping: Record<string, string> = {}

    const detectColumn = (fieldKey: string, patterns: string[]) => {
      const header = csvHeaders.find((h) => patterns.some((pattern) => h.toLowerCase().includes(pattern.toLowerCase())))
      if (header) {
        autoMapping[fieldKey] = header
      }
    }

    detectColumn("stakeholder", ["stakeholder", "name", "organization", "submitter"])
    detectColumn("text", ["comment", "text", "feedback", "response", "message"])
    detectColumn("date", ["date", "submitted", "created", "timestamp"])
    detectColumn("stakeholderType", ["type", "category", "stakeholder_type"])
    detectColumn("provision", ["provision", "section", "topic", "subject"])
    detectColumn("email", ["email", "contact", "address"])

    setMapping(autoMapping)
  }, [csvHeaders])

  const handleMappingChange = (fieldKey: string, csvColumn: string) => {
    setMapping((prev) => ({
      ...prev,
      [fieldKey]: csvColumn === "none" ? "" : csvColumn,
    }))
  }

  const validateMapping = () => {
    const newErrors: string[] = []

    requiredFields.forEach((field) => {
      if (!mapping[field.key]) {
        newErrors.push(`${field.label} is required`)
      }
    })

    // Check for duplicate mappings
    const usedColumns = Object.values(mapping).filter((col) => col !== "")
    const duplicates = usedColumns.filter((col, index) => usedColumns.indexOf(col) !== index)
    if (duplicates.length > 0) {
      newErrors.push(`Duplicate column mappings: ${duplicates.join(", ")}`)
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleProceed = () => {
    if (validateMapping()) {
      onMappingComplete(mapping)
    }
  }

  const allFields = [...requiredFields, ...optionalFields]
  const isValid = validateMapping()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Column Mapping
        </CardTitle>
        <CardDescription>Map your CSV columns to the required data fields</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Required Fields</h4>
            {requiredFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="flex items-center gap-2">
                  {field.label}
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                </Label>
                <Select
                  value={mapping[field.key] || ""}
                  onValueChange={(value) => handleMappingChange(field.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Not mapped --</SelectItem>
                    {csvHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm">Optional Fields</h4>
            {optionalFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="flex items-center gap-2">
                  {field.label}
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </Label>
                <Select
                  value={mapping[field.key] || ""}
                  onValueChange={(value) => handleMappingChange(field.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Not mapped --</SelectItem>
                    {csvHeaders.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {isValid ? (
              <>
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span className="text-sm text-secondary">Mapping is valid</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">Please fix mapping errors</span>
              </>
            )}
          </div>
          <Button onClick={handleProceed} disabled={!isValid || isProcessing}>
            {isProcessing ? "Processing..." : "Start Processing"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
