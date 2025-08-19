import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, company } = await request.json()

    // In production, validate data, hash password, save to database

    // Simulate email already exists check
    if (email === "existing@buildro.ai") {
      return NextResponse.json({ success: false, error: "E-Mail bereits registriert" }, { status: 409 })
    }

    // Mock successful registration
    const newUser = {
      id: Date.now().toString(),
      email,
      name: `${firstName} ${lastName}`,
      company: company || null,
      plan: "starter",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      token: "mock-jwt-token",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server-Fehler" }, { status: 500 })
  }
}
