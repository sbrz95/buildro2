import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getUserBulkTests, createBulkTest } from "@/lib/supabase/projects"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get("projectId")

    const bulkTests = await getUserBulkTests(user.id, projectId || undefined)

    return NextResponse.json({ bulkTests })
  } catch (error) {
    console.error("Error fetching bulk tests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, projectId, agentId, testType, testData } = body

    if (!name || !testType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const bulkTestData = {
      user_id: user.id,
      project_id: projectId,
      agent_id: agentId,
      name,
      test_type: testType,
      test_data: testData || [],
      status: "pending" as const,
    }

    const bulkTest = await createBulkTest(bulkTestData)

    if (!bulkTest) {
      return NextResponse.json({ error: "Failed to create bulk test" }, { status: 500 })
    }

    return NextResponse.json({ bulkTest }, { status: 201 })
  } catch (error) {
    console.error("Error creating bulk test:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
