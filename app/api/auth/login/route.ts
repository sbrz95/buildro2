import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // In production, verify credentials against database
    if (email === "demo@buildro.ai" && password === "demo123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "1",
          email: "demo@buildro.ai",
          name: "Demo User",
          plan: "pro",
        },
        token: "mock-jwt-token",
      })
    }

    return NextResponse.json({ success: false, error: "Ungültige Anmeldedaten" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server-Fehler" }, { status: 500 })
  }
}
