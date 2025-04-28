"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function VisualizePage() {
  const [perturbationLevel, setPerturbationLevel] = useState(0)
  const [attackType, setAttackType] = useState("fgsm")

  // In a real application, these would be generated dynamically based on the perturbation level
  const getImageUrl = () => {
    if (perturbationLevel === 0) {
      return "/placeholder.svg?height=300&width=300"
    } else {
      const noiseLevel = Math.min(perturbationLevel * 10, 100)
      return `/placeholder.svg?height=300&width=300&text=Perturbation:${noiseLevel.toFixed(0)}%`
    }
  }

  const getPredictionText = () => {
    if (perturbationLevel < 0.3) {
      return "Cat (98% confidence)"
    } else if (perturbationLevel < 0.6) {
      return "Cat (75% confidence)"
    } else if (perturbationLevel < 0.8) {
      return "Cat (45% confidence)"
    } else {
      return "Dog (67% confidence)"
    }
  }

  const getNoiseImageUrl = () => {
    const noiseLevel = Math.min(perturbationLevel * 10, 100)
    return `/placeholder.svg?height=300&width=300&text=Noise:${noiseLevel.toFixed(0)}%`
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
            <h1 className="text-3xl font-bold tracking-tight">Visualize Adversarial Attacks</h1>
            <p className="mt-2 text-muted-foreground">
              See how adversarial perturbations affect machine learning model predictions.
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Educational Visualization</AlertTitle>
            <AlertDescription>
              This demo illustrates how small, carefully crafted perturbations can cause machine learning models to make
              incorrect predictions.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="fgsm" onValueChange={setAttackType}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fgsm">FGSM Attack</TabsTrigger>
              <TabsTrigger value="pgd">PGD Attack</TabsTrigger>
              <TabsTrigger value="carlini">Carlini-Wagner</TabsTrigger>
            </TabsList>

            <TabsContent value="fgsm" className="mt-4">
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
                        <Image
                          src={getImageUrl() || "/placeholder.svg"}
                          alt="Perturbed image"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-center text-sm">
                        Model prediction: <span className="font-medium">{getPredictionText()}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-center font-medium">Perturbation Only (Magnified)</div>
                      <div className="relative h-[300px] w-full">
                        <Image
                          src={getNoiseImageUrl() || "/placeholder.svg"}
                          alt="Noise pattern"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        This shows the noise pattern added to the original image
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Perturbation Strength</span>
                      <span>{(perturbationLevel * 10).toFixed(1)}</span>
                    </div>
                    <Slider
                      value={[perturbationLevel]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={(value) => setPerturbationLevel(value[0])}
                    />
                    <p className="text-sm text-muted-foreground">
                      Drag the slider to adjust the strength of the adversarial perturbation and observe how it affects
                      the model's prediction.
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
            </TabsContent>

            <TabsContent value="pgd" className="mt-4">
              <Card className="backdrop-blur-sm bg-background/60 shadow-md">
                <CardHeader>
                  <CardTitle>Projected Gradient Descent (PGD)</CardTitle>
                  <CardDescription>
                    An iterative attack that applies FGSM multiple times with small step sizes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-12 text-muted-foreground">
                    Select this attack type to see a demonstration of the PGD attack method
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="carlini" className="mt-4">
              <Card className="backdrop-blur-sm bg-background/60 shadow-md">
                <CardHeader>
                  <CardTitle>Carlini-Wagner Attack</CardTitle>
                  <CardDescription>
                    A powerful optimization-based attack that creates adversarial examples with minimal perturbation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-12 text-muted-foreground">
                    Select this attack type to see a demonstration of the Carlini-Wagner attack method
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

