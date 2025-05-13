"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function DefendPage() {
  const [selectedDefense, setSelectedDefense] = useState("adversarial")
  const [isDefenseActive, setIsDefenseActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [defenseStats, setDefenseStats] = useState({
    standardModelRobustness: 25,
    enhancedModelRobustness: 78,
    originalPrediction: "Dog (67% confidence)",
    enhancedPrediction: "Cat (89% confidence)",
  })

  // API endpoint for defense (commented out for now)
  const apiEndpoint = process.env.NEXT_PUBLIC_ADVERSARIAL_API_ENDPOINT || "https://145.223.23.193:9899/predict/defend"

  const toggleDefense = async () => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, we would call the API here
      /*
      const formData = new FormData()
      formData.append("defense", selectedDefense)
      formData.append("active", (!isDefenseActive).toString())
      
      const response = await fetch("/api/defend", {
        method: "POST",
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setDefenseStats({
        standardModelRobustness: data.standard_robustness,
        enhancedModelRobustness: data.enhanced_robustness,
        originalPrediction: data.original_prediction,
        enhancedPrediction: data.enhanced_prediction
      })
      */

      // Simulation logic based on defense type
      let simulatedStats = { ...defenseStats }

      if (!isDefenseActive) {
        // Activating defense
        switch (selectedDefense) {
          case "adversarial":
            simulatedStats = {
              standardModelRobustness: 25,
              enhancedModelRobustness: 78,
              originalPrediction: "Dog (67% confidence)",
              enhancedPrediction: "Cat (89% confidence)",
            }
            break
          case "randomization":
            simulatedStats = {
              standardModelRobustness: 25,
              enhancedModelRobustness: 65,
              originalPrediction: "Dog (67% confidence)",
              enhancedPrediction: "Cat (72% confidence)",
            }
            break
          case "detection":
            simulatedStats = {
              standardModelRobustness: 25,
              enhancedModelRobustness: 92,
              originalPrediction: "Dog (67% confidence)",
              enhancedPrediction: "Adversarial Example Detected",
            }
            break
        }
      } else {
        // Deactivating defense - reset to default
        simulatedStats = {
          standardModelRobustness: 25,
          enhancedModelRobustness: 25,
          originalPrediction: "Dog (67% confidence)",
          enhancedPrediction: "Dog (67% confidence)",
        }
      }

      setDefenseStats(simulatedStats)
      setIsDefenseActive(!isDefenseActive)
    } catch (error) {
      console.error("Error toggling defense:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update defense stats when defense type changes
  useEffect(() => {
    if (isDefenseActive) {
      toggleDefense()
    }
  }, [selectedDefense])

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
            <h1 className="text-3xl font-bold tracking-tight">Defense Techniques</h1>
            <p className="mt-2 text-muted-foreground">
              Explore different methods to defend machine learning models against adversarial attacks.
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Simulation Mode</AlertTitle>
            <AlertDescription>
              The defense techniques are currently running in simulation mode. In a production environment, this would
              connect to a secure API endpoint.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="adversarial" onValueChange={setSelectedDefense}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="adversarial">Adversarial Training</TabsTrigger>
              <TabsTrigger value="randomization">Input Randomization</TabsTrigger>
              <TabsTrigger value="detection">Attack Detection</TabsTrigger>
            </TabsList>

            <TabsContent value="adversarial" className="mt-4">
              <Card className="backdrop-blur-sm bg-background/60 shadow-md">
                <CardHeader>
                  <CardTitle>Adversarial Training</CardTitle>
                  <CardDescription>Training models on adversarial examples to make them more robust</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="text-center font-medium">Adversarial Example</div>
                      <div className="relative h-[250px] w-full">
                        <Image
                          src="/placeholder.svg?height=250&width=250&text=Adversarial+Example"
                          alt="Adversarial example"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-center text-sm">
                        Standard model prediction:{" "}
                        <span className="font-medium text-red-500">{defenseStats.originalPrediction}</span>
                      </div>
                      <div className="text-center text-sm">
                        Robust model prediction:{" "}
                        <span className={`font-medium ${isDefenseActive ? "text-green-500" : "text-red-500"}`}>
                          {defenseStats.enhancedPrediction}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="mb-2 font-medium">How It Works</h3>
                        <p className="text-sm text-muted-foreground">
                          Adversarial training incorporates adversarial examples into the training process. By exposing
                          the model to these examples during training, it learns to be robust against similar attacks.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Standard Model Robustness</span>
                            <span className="text-sm">{defenseStats.standardModelRobustness}%</span>
                          </div>
                          <Progress value={defenseStats.standardModelRobustness} className="h-2" />
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Adversarially Trained Model</span>
                            <span className="text-sm">{defenseStats.enhancedModelRobustness}%</span>
                          </div>
                          <Progress value={defenseStats.enhancedModelRobustness} className="h-2" />
                        </div>
                      </div>

                      <Button onClick={toggleDefense} disabled={isLoading}>
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                            Processing...
                          </span>
                        ) : isDefenseActive ? (
                          "Deactivate Defense"
                        ) : (
                          "Activate Defense"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-sm">
                  <p>
                    <strong>Advantages:</strong> Directly improves model robustness against known attack types.
                  </p>
                  <p>
                    <strong>Limitations:</strong> May reduce accuracy on clean examples, and doesn't protect against all
                    attack types.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="randomization" className="mt-4">
              <Card className="backdrop-blur-sm bg-background/60 shadow-md">
                <CardHeader>
                  <CardTitle>Input Randomization</CardTitle>
                  <CardDescription>
                    Adding random noise or transformations to inputs to disrupt adversarial perturbations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="text-center font-medium">Randomized Input</div>
                      <div className="relative h-[250px] w-full">
                        <Image
                          src="/placeholder.svg?height=250&width=250&text=Randomized+Input"
                          alt="Randomized input"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-center text-sm">
                        Standard model prediction:{" "}
                        <span className="font-medium text-red-500">{defenseStats.originalPrediction}</span>
                      </div>
                      <div className="text-center text-sm">
                        Randomized input prediction:{" "}
                        <span className={`font-medium ${isDefenseActive ? "text-green-500" : "text-red-500"}`}>
                          {defenseStats.enhancedPrediction}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="mb-2 font-medium">How It Works</h3>
                        <p className="text-sm text-muted-foreground">
                          Input randomization adds controlled noise or applies transformations like resizing, bit-depth
                          reduction, or JPEG compression to disrupt the carefully crafted adversarial perturbations
                          while preserving the original content.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Standard Model Robustness</span>
                            <span className="text-sm">{defenseStats.standardModelRobustness}%</span>
                          </div>
                          <Progress value={defenseStats.standardModelRobustness} className="h-2" />
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">With Input Randomization</span>
                            <span className="text-sm">{defenseStats.enhancedModelRobustness}%</span>
                          </div>
                          <Progress value={defenseStats.enhancedModelRobustness} className="h-2" />
                        </div>
                      </div>

                      <Button onClick={toggleDefense} disabled={isLoading}>
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                            Processing...
                          </span>
                        ) : isDefenseActive ? (
                          "Deactivate Defense"
                        ) : (
                          "Activate Defense"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-sm">
                  <p>
                    <strong>Advantages:</strong> Easy to implement and can be applied at inference time without
                    retraining models.
                  </p>
                  <p>
                    <strong>Limitations:</strong> May reduce accuracy on clean examples and some adversarial examples
                    can still bypass this defense.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="detection" className="mt-4">
              <Card className="backdrop-blur-sm bg-background/60 shadow-md">
                <CardHeader>
                  <CardTitle>Attack Detection</CardTitle>
                  <CardDescription>
                    Using auxiliary models to detect when an input has been adversarially modified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="text-center font-medium">Detection Analysis</div>
                      <div className="relative h-[250px] w-full">
                        <Image
                          src="/placeholder.svg?height=250&width=250&text=Detection+Analysis"
                          alt="Detection analysis"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-center text-sm">
                        Standard model prediction:{" "}
                        <span className="font-medium text-red-500">{defenseStats.originalPrediction}</span>
                      </div>
                      <div className="text-center text-sm">
                        Detection result:{" "}
                        <span className={`font-medium ${isDefenseActive ? "text-green-500" : "text-red-500"}`}>
                          {defenseStats.enhancedPrediction}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="mb-2 font-medium">How It Works</h3>
                        <p className="text-sm text-muted-foreground">
                          Attack detection uses specialized models or statistical methods to identify when an input has
                          been adversarially modified. When an attack is detected, the system can reject the input or
                          apply additional defenses.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Standard Model Robustness</span>
                            <span className="text-sm">{defenseStats.standardModelRobustness}%</span>
                          </div>
                          <Progress value={defenseStats.standardModelRobustness} className="h-2" />
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">With Attack Detection</span>
                            <span className="text-sm">{defenseStats.enhancedModelRobustness}%</span>
                          </div>
                          <Progress value={defenseStats.enhancedModelRobustness} className="h-2" />
                        </div>
                      </div>

                      <Button onClick={toggleDefense} disabled={isLoading}>
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                            Processing...
                          </span>
                        ) : isDefenseActive ? (
                          "Deactivate Defense"
                        ) : (
                          "Activate Defense"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-sm">
                  <p>
                    <strong>Advantages:</strong> Can identify attacks without modifying the original model and provides
                    explicit feedback about potential threats.
                  </p>
                  <p>
                    <strong>Limitations:</strong> Sophisticated attacks may evade detection, and false positives can
                    impact legitimate users.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
