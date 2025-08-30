import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Ungültige Anmeldedaten",
        },
        { status: 401 },
      )
    }

    if (!data.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Anmeldung fehlgeschlagen",
        },
        { status: 401 },
      )
    }

    // Get user profile from database
    const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.full_name || data.user.user_metadata?.full_name || "User",
        plan: profile?.subscription_plan || "starter",
      },
      session: data.session,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Server-Fehler",
      },
      { status: 500 },
    )
  }
}
