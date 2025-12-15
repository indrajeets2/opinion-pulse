"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { FileUpload } from "@/components/file-upload"
import { ColumnMapping } from "@/components/column-mapping"
import { ProcessingStatus } from "@/components/processing-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Upload, ArrowRight, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

type UploadStep = "upload" | "mapping" | "processing" | "complete"

export default function UploadPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<UploadStep>("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)

    // Parse CSV headers
    const text = await file.text()
    const lines = text.split("\n")
    if (lines.length > 0) {
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
      setCsvHeaders(headers)
      setCurrentStep("mapping")
    }
  }

  const handleMappingComplete = (mapping: Record<string, string>) => {
    setColumnMapping(mapping)
    setCurrentStep("processing")
    setIsProcessing(true)

    // Simulate processing count
    const text = selectedFile?.size || 1000
    const estimatedComments = Math.floor(text / 200) // Rough estimate
    setProcessedCount(Math.max(10, Math.min(estimatedComments, 50)))
  }

  const handleProcessingComplete = () => {
    setIsProcessing(false)
    setCurrentStep("complete")
  }

  const handleStartOver = () => {
    setCurrentStep("upload")
    setSelectedFile(null)
    setCsvHeaders([])
    setColumnMapping({})
    setIsProcessing(false)
    setProcessedCount(0)
  }

  const getStepStatus = (step: UploadStep) => {
    const steps: UploadStep[] = ["upload", "mapping", "processing", "complete"]
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "current"
    return "upcoming"
  }

  return (
    <AuthGuard>
      <Navigation />
      <div className="md:ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Upload & Process Comments</h1>
            <p className="text-muted-foreground mt-2">Import stakeholder feedback for AI-powered sentiment analysis</p>
          </div>

          {/* Progress Steps */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                {[
                  { key: "upload", label: "Upload File", icon: Upload },
                  { key: "mapping", label: "Map Columns", icon: ArrowRight },
                  { key: "processing", label: "AI Analysis", icon: CheckCircle },
                  { key: "complete", label: "Complete", icon: CheckCircle },
                ].map((step, index) => {
                  const Icon = step.icon
                  const status = getStepStatus(step.key as UploadStep)
                  return (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            status === "completed"
                              ? "bg-secondary border-secondary text-secondary-foreground"
                              : status === "current"
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-muted-foreground/30 text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span
                          className={`text-xs mt-2 ${status === "current" ? "font-medium" : "text-muted-foreground"}`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < 3 && (
                        <div
                          className={`w-16 h-0.5 mx-2 ${
                            getStepStatus(["upload", "mapping", "processing", "complete"][index + 1] as UploadStep) ===
                            "completed"
                              ? "bg-secondary"
                              : "bg-muted-foreground/30"
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          {currentStep === "upload" && <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />}

          {currentStep === "mapping" && (
            <ColumnMapping
              csvHeaders={csvHeaders}
              onMappingComplete={handleMappingComplete}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === "processing" && (
            <ProcessingStatus
              isProcessing={isProcessing}
              onComplete={handleProcessingComplete}
              totalComments={processedCount}
            />
          )}

          {currentStep === "complete" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  Processing Complete
                </CardTitle>
                <CardDescription>Your comments have been successfully analyzed and imported</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{processedCount} comments</strong> have been processed and are now available for review in
                    the Comments Explorer.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{Math.floor(processedCount * 0.4)}</div>
                    <div className="text-xs text-muted-foreground">Positive</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{Math.floor(processedCount * 0.3)}</div>
                    <div className="text-xs text-muted-foreground">Negative</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{Math.floor(processedCount * 0.3)}</div>
                    <div className="text-xs text-muted-foreground">Neutral</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{Math.floor(processedCount * 0.15)}</div>
                    <div className="text-xs text-muted-foreground">Flagged</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" onClick={handleStartOver}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Upload Another File
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push("/")}>
                      View Dashboard
                    </Button>
                    <Button onClick={() => router.push("/comments")}>Review Comments</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
