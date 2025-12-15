"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Loader2, BarChart3, MessageSquare, Brain } from "lucide-react"

interface ProcessingStep {
  id: string
  label: string
  status: "pending" | "processing" | "completed" | "error"
  progress: number
  icon: React.ComponentType<{ className?: string }>
}

interface ProcessingStatusProps {
  isProcessing: boolean
  onComplete: () => void
  totalComments: number
}

export function ProcessingStatus({ isProcessing, onComplete, totalComments }: ProcessingStatusProps) {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: "parse",
      label: "Parsing CSV Data",
      status: "pending",
      progress: 0,
      icon: MessageSquare,
    },
    {
      id: "sentiment",
      label: "Analyzing Sentiment",
      status: "pending",
      progress: 0,
      icon: Brain,
    },
    {
      id: "summary",
      label: "Generating Summaries",
      status: "pending",
      progress: 0,
      icon: BarChart3,
    },
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [processedComments, setProcessedComments] = useState(0)

  useEffect(() => {
    if (!isProcessing) return

    const processSteps = async () => {
      // Step 1: Parse CSV
      setSteps((prev) =>
        prev.map((step, index) => ({
          ...step,
          status: index === 0 ? "processing" : "pending",
        })),
      )

      // Simulate parsing
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setSteps((prev) =>
          prev.map((step, index) => ({
            ...step,
            progress: index === 0 ? i : 0,
          })),
        )
        setOverallProgress(i / 3)
      }

      setSteps((prev) =>
        prev.map((step, index) => ({
          ...step,
          status: index === 0 ? "completed" : index === 1 ? "processing" : "pending",
        })),
      )
      setCurrentStep(1)

      // Step 2: Sentiment Analysis
      for (let i = 0; i <= 100; i += 5) {
        await new Promise((resolve) => setTimeout(resolve, 150))
        setSteps((prev) =>
          prev.map((step, index) => ({
            ...step,
            progress: index === 1 ? i : index === 0 ? 100 : 0,
          })),
        )
        setOverallProgress(33 + i / 3)
        setProcessedComments(Math.floor((i / 100) * totalComments))
      }

      setSteps((prev) =>
        prev.map((step, index) => ({
          ...step,
          status: index <= 1 ? "completed" : index === 2 ? "processing" : "pending",
        })),
      )
      setCurrentStep(2)

      // Step 3: Generate Summaries
      for (let i = 0; i <= 100; i += 8) {
        await new Promise((resolve) => setTimeout(resolve, 120))
        setSteps((prev) =>
          prev.map((step, index) => ({
            ...step,
            progress: index === 2 ? i : index <= 1 ? 100 : 0,
          })),
        )
        setOverallProgress(66 + i / 3)
      }

      setSteps((prev) =>
        prev.map((step) => ({
          ...step,
          status: "completed",
          progress: 100,
        })),
      )
      setOverallProgress(100)
      setProcessedComments(totalComments)

      // Complete processing
      setTimeout(() => {
        onComplete()
      }, 1000)
    }

    processSteps()
  }, [isProcessing, onComplete, totalComments])

  const getStatusIcon = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "processing":
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
    }
  }

  const getStatusColor = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "completed":
        return "text-secondary"
      case "processing":
        return "text-primary"
      case "error":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  if (!isProcessing && overallProgress === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Processing Comments
        </CardTitle>
        <CardDescription>AI analysis in progress - this may take a few minutes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(step.status)}
                  <Icon className={`h-4 w-4 ${getStatusColor(step.status)}`} />
                  <span className={`text-sm font-medium ${getStatusColor(step.status)}`}>{step.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={step.status === "completed" ? "secondary" : "outline"} className="text-xs">
                    {step.progress}%
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>

        {processedComments > 0 && (
          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              Processed {processedComments} of {totalComments} comments
            </AlertDescription>
          </Alert>
        )}

        {overallProgress === 100 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              Processing complete! {totalComments} comments have been analyzed and are ready for review.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
