import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_ADVERSARIAL_API_ENDPOINT

    if (!apiEndpoint) {
      return NextResponse.json({ error: "API endpoint is not defined in environment variables" }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log(`Sending file to API: ${apiEndpoint}`)
    console.log(`File name: ${file.name}, size: ${file.size} bytes`)

    // Since the API requires HTTPS, we'll simulate a response for now
    // In a production environment, you would need to ensure the API supports HTTPS
    // or set up a secure proxy server
    /*
    console.log("API requires HTTPS. Using simulated response for demonstration.")

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate a simulated response based on the file
    const isExecutable =
      file.name.endsWith(".exe") ||
      file.name.endsWith(".dll") ||
      file.name.endsWith(".sys") ||
      file.name.endsWith(".scr")

    // Randomly determine if the file is adversarial, with higher chance for executable files
    const isAdversarial = Math.random() > (isExecutable ? 0.3 : 0.7)
    const confidenceScore = Math.round(Math.random() * 30 + 70) / 100 // Between 0.7 and 1.0

    const simulatedResponse = {
      classification: isAdversarial ? "Adversarial" : "Clean",
      score: confidenceScore,
      file_name: file.name,
      analysis_time: new Date().toISOString(),
    }

    console.log("Simulated response:", simulatedResponse)

    return NextResponse.json(simulatedResponse)
  */
     
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
    
  } catch (error: any) {
    console.error("Error in classify API route:", error)
    return NextResponse.json({ error: error?.message || "An unknown error occurred" }, { status: 500 })
  }
}
