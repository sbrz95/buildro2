import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { shouldRedirectToHttps, domainConfig } from "./lib/config/domain"

// Define protected routes that require authentication
const protectedRoutes = [
  "/build",
  "/demo",
  "/launch",
  "/improve",
  "/bulk-tester",
  "/marketplace",
  "/affiliate",
  "/ai-mentor",
  "/api-keys",
  "/settings",
  "/support",
]

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/about",
  "/impressum",
  "/datenschutz",
  "/ai-act",
  "/public-marketplace",
  "/d", // Public demo viewer
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldRedirectToHttps(request)) {
    const httpsUrl = new URL(request.url)
    httpsUrl.protocol = "https:"
    return NextResponse.redirect(httpsUrl)
  }

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  // Allow API routes and static files to pass through
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next()
  }

  if (isProtectedRoute) {
    // Add a header to indicate this is a protected route
    const response = NextResponse.next()
    response.headers.set("x-protected-route", "true")
    if (domainConfig.isProduction) {
      response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
      response.headers.set("X-Frame-Options", "DENY")
      response.headers.set("X-Content-Type-Options", "nosniff")
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
