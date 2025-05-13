"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function VisualizePage() {
  const [perturbationLevel, setPerturbationLevel] = useState(0)
  const [originalImage, setOriginalImage] = useState("/placeholder.svg?height=300&width=300&text=Original+Image")
  const [perturbedImage, setPerturbedImage] = useState("/placeholder.svg?height=300&width=300&text=Perturbed+Image")
  const [noiseImage, setNoiseImage] = useState("/placeholder.svg?height=300&width=300&text=Noise+Pattern")
  const [prediction, setPrediction] = useState("Cat (98% confidence)")
  const [isLoading, setIsLoading] = useState(false)

  // API endpoint for PGD attack (commented out for now)
  const apiEndpoint = process.env.NEXT_PUBLIC_ADVERSARIAL_API_ENDPOINT || "https://145.223.23.193:9899/predict/pgd"

  // Update images and prediction when perturbation level changes
  useEffect(() => {
    const updateVisualization = async () => {
      if (perturbationLevel === 0) {
        setPerturbedImage("/placeholder.svg?height=300&width=300&text=Original+Image")
        setNoiseImage("/placeholder.svg?height=300&width=300&text=No+Noise")
        setPrediction("Cat (98% confidence)")
        return
      }

      setIsLoading(true)

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // In a real implementation, we would call the API here
        /*
        const formData = new FormData()
        formData.append("epsilon", perturbationLevel.toString())
        
        const response = await fetch("/api/visualize", {
          method: "POST",
          body: formData
        })
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const data = await response.json()
        setPerturbedImage(data.perturbed_image)
        setNoiseImage(data.noise_pattern)
        setPrediction(data.prediction)
        */

        // Simulation logic
        const noiseLevel = Math.min(perturbationLevel * 10, 100)

        // Simulate different predictions based on perturbation level
        let simulatedPrediction
        if (perturbationLevel < 0.3) {
          simulatedPrediction = `Cat (${Math.round(98 - perturbationLevel * 100)}% confidence)`
        } else if (perturbationLevel < 0.6) {
          simulatedPrediction = `Cat (${Math.round(75 - (perturbationLevel - 0.3) * 100)}% confidence)`
        } else if (perturbationLevel < 0.8) {
          simulatedPrediction = `Cat (${Math.round(45 - (perturbationLevel - 0.6) * 100)}% confidence)`
        } else {
          simulatedPrediction = `Dog (${Math.round(50 + (perturbationLevel - 0.8) * 100)}% confidence)`
        }

        setPerturbedImage(`/placeholder.svg?height=300&width=300&text=Perturbed+Image:${noiseLevel.toFixed(0)}%`)
        setNoiseImage(`/placeholder.svg?height=300&width=300&text=Noise:${noiseLevel.toFixed(0)}%`)
        setPrediction(simulatedPrediction)
      } catch (error) {
        console.error("Error updating visualization:", error)
      } finally {
        setIsLoading(false)
      }
    }

    updateVisualization()
  }, [perturbationLevel])

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
            <h1 className="text-3xl font-bold tracking-tight">Visualize Adversarial Attacks</h1>
            <p className="mt-2 text-muted-foreground">
              See how adversarial perturbations affect machine learning model predictions.
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Simulation Mode</AlertTitle>
            <AlertDescription>
              The attack visualization is currently running in simulation mode. In a production environment, this would
              connect to a secure API endpoint.
            </AlertDescription>
          </Alert>

          <Card className="backdrop-blur-sm bg-background/60 shadow-md">
            <CardHeader>
              <CardTitle>Fast Gradient Sign Method (FGSM)</CardTitle>
              <CardDescription>
                A one-step attack that perturbs an image in the direction that maximizes the loss function
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="text-center font-medium">Original + Perturbation</div>
                  <div className="relative h-[300px] w-full">
                    <div
                      className={`absolute inset-0 flex items-center justify-center ${isLoading ? "opacity-50" : ""}`}
                    >
                      <Image
                        src={perturbedImage || "/placeholder.svg"}
                        alt="Perturbed image"
                        fill
                        className="object-contain"
                      />
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center text-sm">
                    Model prediction: <span className="font-medium">{prediction}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center font-medium">Perturbation Only (Magnified)</div>
                  <div className="relative h-[300px] w-full">
                    <div
                      className={`absolute inset-0 flex items-center justify-center ${isLoading ? "opacity-50" : ""}`}
                    >
                      <Image
                        src={noiseImage || "/placeholder.svg"}
                        alt="Noise pattern"
                        fill
                        className="object-contain"
                      />
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    This shows the noise pattern added to the original image
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span>Perturbation Strength (ε)</span>
                  <span>{(perturbationLevel * 0.3).toFixed(2)}</span>
                </div>
                <Slider
                  value={[perturbationLevel]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => setPerturbationLevel(value[0])}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Drag the slider to adjust the strength of the adversarial perturbation and observe how it affects the
                  model's prediction.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-sm">
              <p>
                The Fast Gradient Sign Method (FGSM) creates adversarial examples by adding perturbations in the
                direction of the gradient of the loss function with respect to the input.
              </p>
              <p>
                Even with perturbations that are imperceptible to humans, the model's prediction can change
                dramatically.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
