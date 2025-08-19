import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, description, attachments, gdprConsent } = body

    // Validate required fields
    if (!name || !email || !subject || !description || !gdprConsent) {
      return NextResponse.json(
        { error: "Alle Pflichtfelder müssen ausgefüllt werden und der Datenschutz-Einwilligung zugestimmt werden." },
        { status: 400 },
      )
    }

    // Mock ticket creation
    const ticket = {
      id: `TICKET-${Date.now()}`,
      name,
      email,
      subject,
      description,
      attachments: attachments || [],
      status: "open",
      priority: "normal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: null,
      gdprConsent,
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send notification emails
    // 3. Create ticket in support system
    // 4. Log GDPR consent

    console.log("Support ticket created:", ticket)

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
      message: "Support-Ticket erfolgreich erstellt. Sie erhalten eine Bestätigungs-E-Mail.",
    })
  } catch (error) {
    console.error("Error creating support ticket:", error)
    return NextResponse.json({ error: "Fehler beim Erstellen des Support-Tickets" }, { status: 500 })
  }
}

export async function GET() {
  // Mock support statistics
  const stats = {
    openTickets: 3,
    averageResponseTime: "2.4h",
    totalTickets: 127,
    resolvedToday: 8,
    satisfaction: 4.8,
  }

  return NextResponse.json(stats)
}
