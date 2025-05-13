"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Upload, FileText, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ClassifyPage() {
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number | null>(null)
  const [analysisDetails, setAnalysisDetails] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      if (selectedFile.type.startsWith("image/")) {
        try {
          const reader = new FileReader()
          reader.onload = (event) => {
            if (event.target) {
              setFilePreview(event.target.result as string)
            }
          }
          reader.readAsDataURL(selectedFile)
        } catch (err) {
          console.error("Error creating file preview:", err)
          setFilePreview(null)
        }
      } else {
        setFilePreview(null)
      }

      setError(null)
      setResult(null)
      setConfidence(null)
      setAnalysisDetails(null)
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true)
      setError(null)
      setResult(null)
      setConfidence(null)
      setAnalysisDetails(null)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      })

      const contentType = response.headers.get("content-type")

      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`

        if (contentType?.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } else {
          const text = await response.text()
          errorMessage = text || errorMessage
        }

        throw new Error(errorMessage)
      }

      if (!contentType?.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Expected JSON, got: ${text}`)
      }

      const data = await response.json()
      console.log("Classification result:", data)

      // Store the full analysis details
      setAnalysisDetails(data)

      // Extract the main classification result
      setResult(data.classification)

      // Convert score to percentage for display
      if (data.score !== undefined) {
        setConfidence(Math.round(data.score * 100))
      }
    } catch (error: any) {
      console.error("File classification failed:", error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 relative">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] pointer-events-none" />
      <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="container max-w-4xl py-12 relative z-10">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Classify File</h1>
            <p className="mt-2 text-muted-foreground">Upload any file to analyze for adversarial perturbations.</p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Simulation Mode</AlertTitle>
            <AlertDescription>
              The classifier is currently running in simulation mode. In a production environment, this would connect to
              a secure API endpoint.
            </AlertDescription>
          </Alert>

          <Card className="backdrop-blur-sm bg-background/60 shadow-md">
            <CardHeader>
              <CardTitle>File Classifier</CardTitle>
              <CardDescription>Upload a file to analyze it for potential adversarial modifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div
                    className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-100/50"
                    onClick={triggerFileInput}
                  >
                    {filePreview ? (
                      <img
                        src={filePreview || "/placeholder.svg"}
                        alt="Uploaded file preview"
                        className="object-contain p-2 h-full w-full"
                      />
                    ) : file ? (
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="h-16 w-16 text-gray-400 mb-3" />
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">Any file type (MAX. 10MB)</p>
                      </div>
                    )}
                    <Input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>

                {file && (
                  <div className="flex justify-center">
                    <Button onClick={() => handleFileUpload(file)} disabled={loading} className="w-full max-w-xs">
                      {loading ? "Analyzing..." : "Analyze File"}
                    </Button>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>

            {result && (
              <CardFooter className="flex flex-col space-y-4">
                <div className="w-full rounded-lg bg-muted p-4">
                  <div className="mb-2 font-medium">Classification Result:</div>
                  <div className="flex items-center justify-between">
                    <span className={result === "Adversarial" ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                      {result}
                    </span>
                    {confidence !== null && (
                      <span className="text-sm text-muted-foreground">Confidence: {confidence}%</span>
                    )}
                  </div>

                  {analysisDetails && analysisDetails.file_name && (
                    <div className="mt-4 text-sm">
                      <div>
                        <strong>File:</strong> {analysisDetails.file_name}
                      </div>
                      {analysisDetails.analysis_time && (
                        <div>
                          <strong>Analysis time:</strong> {new Date(analysisDetails.analysis_time).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {result === "Adversarial"
                    ? "This file appears to contain adversarial perturbations."
                    : "This file appears clean with no detectable adversarial content."}
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
