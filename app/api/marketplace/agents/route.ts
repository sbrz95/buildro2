import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const agentData = await request.json()

    // Mock validation
    const requiredFields = ["title", "description", "price", "category", "features", "downloadLink", "supportEmail"]
    const missingFields = requiredFields.filter((field) => !agentData[field])

    if (missingFields.length > 0) {
      return NextResponse.json({ error: "Missing required fields", fields: missingFields }, { status: 400 })
    }

    // Mock agent creation
    const newAgent = {
      id: Math.random().toString(36).substr(2, 9),
      ...agentData,
      author: "buildro.ai",
      rating: 0,
      downloads: 0,
      createdAt: new Date().toISOString(),
      status: "pending_review",
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      agent: newAgent,
      message: "Agent erfolgreich hochgeladen und wird überprüft",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  // Mock agent list for admin
  const agents = [
    {
      id: "1",
      title: "Customer Support Pro",
      status: "approved",
      downloads: 1247,
      revenue: 36743.53,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Sales Assistant Elite",
      status: "approved",
      downloads: 892,
      revenue: 44595.08,
      createdAt: "2024-01-20",
    },
  ]

  return NextResponse.json({ agents })
}
