import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Mock: Handle file upload
    const mockUrl = `/mock/cdn/${Date.now()}/bg.png`

    return NextResponse.json({ url: mockUrl })
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
