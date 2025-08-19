export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto section-spacing">
      <div className="content-spacing">
        <div className="text-center mb-12">
          <div className="h-10 bg-muted rounded-lg animate-pulse mb-4"></div>
          <div className="h-6 bg-muted rounded-lg animate-pulse max-w-md mx-auto"></div>
        </div>

        <div className="grid gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-container border rounded-lg p-6">
              <div className="h-6 bg-muted rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
