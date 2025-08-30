import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from: "buildro.ai <noreply@buildro.ai>",
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error("Email sending error:", error)
      throw new Error("Failed to send email")
    }

    return { success: true, data }
  } catch (error) {
    console.error("Email service error:", error)
    throw error
  }
}

export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Willkommen bei buildro.ai!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(90deg, #a855f7 0%, #3b82f6 50%, #10b981 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Willkommen bei buildro.ai</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Hallo ${name}!</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Vielen Dank für Ihre Registrierung bei buildro.ai! Sie können jetzt mit dem Erstellen Ihrer KI-Agenten beginnen.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/build" 
               style="background: linear-gradient(90deg, #a855f7 0%, #3b82f6 50%, #10b981 100%); 
                      color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: 6px; display: inline-block;">
              Jetzt starten
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Bei Fragen stehen wir Ihnen gerne zur Verfügung.
          </p>
        </div>
      </div>
    `,
  }),

  passwordReset: (resetLink: string) => ({
    subject: "Passwort zurücksetzen - buildro.ai",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(90deg, #a855f7 0%, #3b82f6 50%, #10b981 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Passwort zurücksetzen</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Passwort zurücksetzen</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(90deg, #a855f7 0%, #3b82f6 50%, #10b981 100%); 
                      color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: 6px; display: inline-block;">
              Passwort zurücksetzen
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Dieser Link ist 24 Stunden gültig. Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.
          </p>
        </div>
      </div>
    `,
  }),

  supportTicket: (ticketId: string, subject: string) => ({
    subject: `Support-Ticket erstellt: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(90deg, #a855f7 0%, #3b82f6 50%, #10b981 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Support-Ticket erstellt</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Ticket #${ticketId}</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Ihr Support-Ticket wurde erfolgreich erstellt. Unser Team wird sich in Kürze bei Ihnen melden.
          </p>
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <strong style="color: #1f2937;">Betreff:</strong> ${subject}
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Sie erhalten eine weitere E-Mail, sobald unser Team auf Ihr Ticket geantwortet hat.
          </p>
        </div>
      </div>
    `,
  }),
}
