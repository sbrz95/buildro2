import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { projectName, openaiApiKey } = await request.json()

    // Validation
    if (!projectName?.trim() || !openaiApiKey?.trim()) {
      return NextResponse.json({ error: "Project name and OpenAI API key are required" }, { status: 400 })
    }

    // Mock encryption and storage
    const encryptedKey = `encrypted_${openaiApiKey.slice(0, 7)}...${openaiApiKey.slice(-4)}`

    // Create mock API key entry
    const newKey = {
      id: `proj_${Date.now()}`,
      name: `${projectName} (OpenAI)`,
      key: openaiApiKey, // In real app, this would be encrypted
      maskedKey: `${openaiApiKey.slice(0, 7)}...${openaiApiKey.slice(-4)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      isActive: true,
      type: "project",
      projectName,
    }

    // Mock successful response
    return NextResponse.json({
      success: true,
      message: "Project API key added successfully",
      key: newKey,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add project API key" }, { status: 500 })
  }
}
