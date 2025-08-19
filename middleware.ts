import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

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

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  // Allow API routes and static files to pass through
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // Get authentication status from request headers or cookies
  // Since we're using localStorage, we'll need to handle this on the client side
  // For now, we'll let the client-side auth handle redirects

  if (isProtectedRoute) {
    // Add a header to indicate this is a protected route
    const response = NextResponse.next()
    response.headers.set("x-protected-route", "true")
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
