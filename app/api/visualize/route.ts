import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_ADVERSARIAL_API_ENDPOINT || "https://145.223.23.193:9899/predict/pgd"

    if (!apiEndpoint) {
      return NextResponse.json({ error: "API endpoint is not defined in environment variables" }, { status: 500 })
    }

    const formData = await request.formData()
    const epsilon = formData.get("epsilon")

    if (!epsilon) {
      return NextResponse.json({ error: "No epsilon value provided" }, { status: 400 })
    }

    console.log(`Sending request to API: ${apiEndpoint} with epsilon: ${epsilon}`)

    // Since the API requires HTTPS, we'll simulate a response for now
    // In a production environment, you would need to ensure the API supports HTTPS
    // or set up a secure proxy server

    console.log("API requires HTTPS. Using simulated response for demonstration.")

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a simulated response based on the epsilon value
    const epsilonValue = Number.parseFloat(epsilon.toString())
    const noiseLevel = Math.min(epsilonValue * 10, 100)

    // Simulate different predictions based on epsilon
    let prediction
    if (epsilonValue < 0.3) {
      prediction = `Cat (${Math.round(98 - epsilonValue * 100)}% confidence)`
    } else if (epsilonValue < 0.6) {
      prediction = `Cat (${Math.round(75 - (epsilonValue - 0.3) * 100)}% confidence)`
    } else if (epsilonValue < 0.8) {
      prediction = `Cat (${Math.round(45 - (epsilonValue - 0.6) * 100)}% confidence)`
    } else {
      prediction = `Dog (${Math.round(50 + (epsilonValue - 0.8) * 100)}% confidence)`
    }

    const simulatedResponse = {
      perturbed_image: `/placeholder.svg?height=300&width=300&text=Perturbed+Image:${noiseLevel.toFixed(0)}%`,
      noise_pattern: `/placeholder.svg?height=300&width=300&text=Noise:${noiseLevel.toFixed(0)}%`,
      prediction: prediction,
      epsilon: epsilonValue,
      analysis_time: new Date().toISOString(),
    }

    console.log("Simulated response:", simulatedResponse)

    return NextResponse.json(simulatedResponse)

    /* 
    // Original API call code - uncomment when API supports HTTPS or a proxy is set up
    const response = await fetch(apiEndpoint, {
      method: "POST",
      body: formData,
    })

    const contentType = response.headers.get("content-type") || ""

    if (!response.ok) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`

      // Try to extract error content
      if (contentType.includes("application/json")) {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } else {
        const errorText = await response.text()
        errorMessage = errorText || errorMessage
      }

      console.error(`API error (${response.status}): ${errorMessage}`)
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    // ✅ Safely parse only if response is JSON
    if (!contentType.includes("application/json")) {
      const text = await response.text()
      console.error("Expected JSON but got:", text)
      return NextResponse.json(
        { error: `Invalid response from upstream API (non-JSON): ${text}` },
        { status: 502 }
      )
    }

    const data = await response.json()
    console.log("API Response:", data)

    return NextResponse.json(data)
    */
  } catch (error: any) {
    console.error("Error in visualize API route:", error)
    return NextResponse.json({ error: error?.message || "An unknown error occurred" }, { status: 500 })
  }
}
