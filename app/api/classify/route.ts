import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the API key from environment variables (server-side only)
    const apiKey = process.env.ADVERSARIAL_API_KEY
    const apiEndpoint = process.env.NEXT_PUBLIC_ADVERSARIAL_API_ENDPOINT

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured on server" }, { status: 500 })
    }

    if (!apiEndpoint) {
      return NextResponse.json({ error: "API endpoint not configured on server" }, { status: 500 })
    }

    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Forward the request to the actual API
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `API error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    // Get the response data
    const data = await response.json()

    // Return the response
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in classify API route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
