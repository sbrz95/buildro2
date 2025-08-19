import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    // Mock Google OAuth verification
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock Google user data
    const googleUser = {
      id: "google_123456789",
      email: "user@gmail.com",
      name: "Google User",
      picture: "https://lh3.googleusercontent.com/a/default-user",
      verified_email: true,
    }

    // Create or update user in database (mock)
    const user = {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      plan: "starter",
      provider: "google",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      user,
      token: "mock_jwt_token_google_" + Date.now(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Google authentication failed" }, { status: 400 })
  }
}
