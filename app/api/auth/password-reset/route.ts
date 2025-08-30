import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, emailTemplates } from "@/lib/email/resend"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "E-Mail-Adresse ist erforderlich" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user exists
    const { data: user } = await supabase.from("users").select("id, email, name").eq("email", email).single()

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message:
          "Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail zum Zurücksetzen des Passworts gesendet.",
      })
    }

    // Generate reset token (in production, store this in database with expiration)
    const resetToken = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    // Send password reset email
    const resetTemplate = emailTemplates.passwordReset(resetLink)
    await sendEmail({
      to: email,
      subject: resetTemplate.subject,
      html: resetTemplate.html,
    })

    return NextResponse.json({
      message:
        "Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde eine E-Mail zum Zurücksetzen des Passworts gesendet.",
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Fehler beim Senden der E-Mail" }, { status: 500 })
  }
}
