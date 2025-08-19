import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { exportUserData } from "@/lib/privacy/data-access"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await exportUserData(user.id)

    // Return as downloadable JSON file
    const response = new NextResponse(JSON.stringify(userData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="buildro-data-export-${user.id}.json"`,
      },
    })

    return response
  } catch (error) {
    console.error("Error exporting user data:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
