import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { deleteAllUserData } from "@/lib/privacy/data-access"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { confirmation } = body

    // Require explicit confirmation
    if (confirmation !== "DELETE_MY_ACCOUNT") {
      return NextResponse.json({ error: "Account deletion requires explicit confirmation" }, { status: 400 })
    }

    await deleteAllUserData(user.id)

    return NextResponse.json({ message: "Account and all data deleted successfully" })
  } catch (error) {
    console.error("Error deleting user account:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
