import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackButton } from "@/components/ui/back-button"

export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto section-spacing content-padding">
      <BackButton />

      <div className="content-spacing">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Impressum</h1>
          <p className="text-xl text-muted-foreground">Rechtliche Angaben gemäß § 5 TMG</p>
        </div>

        <div className="grid gap-6">
          <Card className="card-container">
            <CardHeader>
              <CardTitle>Angaben gemäß § 5 TMG</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Anbieter:</h3>
                <p>Fercon</p>
                <p>Landsberger Allee 548</p>
                <p>12681 Berlin</p>
                <p>Deutschland</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  buildro.ai ist ein geführter Handelsname der Marke Fercon
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Kontakt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p>
                  <strong>Telefon:</strong> 015129438092
                </p>
                <p>
                  <strong>E-Mail:</strong> info@buildro.ai
                </p>
                <p>
                  <strong>Website:</strong> https://buildro.ai
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Geschäftsführung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p>Nick Reichardt</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p>Fercon</p>
                <p>Landsberger Allee 548</p>
                <p>12681 Berlin</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Haftungsausschluss</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Haftung für Inhalte</h4>
                <p className="text-sm text-muted-foreground">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
                  allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                  unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
                  Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Haftung für Links</h4>
                <p className="text-sm text-muted-foreground">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
                  Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                  verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Urheberrecht</h4>
                <p className="text-sm text-muted-foreground">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
                  Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
                  Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw.
                  Erstellers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-container">
            <CardHeader>
              <CardTitle>Streitschlichtung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    className="text-blue-600 hover:underline ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
