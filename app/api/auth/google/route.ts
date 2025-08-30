import { type NextRequest, NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 })
    }

    // <CHANGE> Replace mock verification with real Google OAuth token verification
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 400 })
    }

    // Extract user information from Google payload
    const googleUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      verified_email: payload.email_verified,
    }

    // Create or update user in database
    const user = {
      id: googleUser.id,
      email: googleUser.email!,
      name: googleUser.name!,
      plan: "starter",
      provider: "google",
      createdAt: new Date().toISOString(),
    }

    // <CHANGE> Generate a proper JWT token or session token here
    const authToken = "jwt_token_" + Date.now() // Replace with proper JWT generation

    return NextResponse.json({
      success: true,
      user,
      token: authToken,
    })
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.json({ success: false, error: "Google authentication failed" }, { status: 400 })
  }
}
