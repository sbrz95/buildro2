export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-8"></div>
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-6"></div>
            <div className="h-12 bg-muted rounded w-96 mx-auto mb-6"></div>
            <div className="h-6 bg-muted rounded w-full max-w-3xl mx-auto mb-2"></div>
            <div className="h-6 bg-muted rounded w-2/3 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="h-48 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
