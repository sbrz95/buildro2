export const getDomainConfig = () => {
  const isDevelopment = process.env.NODE_ENV === "development"
  const isProduction = process.env.NODE_ENV === "production"

  const config = {
    // Base URLs
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || (isDevelopment ? "http://localhost:3000" : "https://getbuildro.com"),
    API_URL:
      process.env.NEXT_PUBLIC_API_URL || (isDevelopment ? "http://localhost:3000/api" : "https://getbuildro.com/api"),

    // Domain settings
    DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || (isDevelopment ? "localhost:3000" : "getbuildro.com"),
    PROTOCOL: process.env.NEXT_PUBLIC_PROTOCOL || (isDevelopment ? "http" : "https"),

    // SSL and security
    FORCE_HTTPS: process.env.NEXT_PUBLIC_FORCE_HTTPS === "true" || isProduction,
    SECURE_COOKIES: process.env.NEXT_PUBLIC_SECURE_COOKIES === "true" || isProduction,

    // Environment flags
    isDevelopment,
    isProduction,

    // Helper methods
    getFullUrl: (path = "") => {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || (isDevelopment ? "http://localhost:3000" : "https://getbuildro.com")
      return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
    },

    getApiUrl: (endpoint = "") => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || (isDevelopment ? "http://localhost:3000/api" : "https://getbuildro.com/api")
      return `${apiUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
    },
  }

  return config
}

export const domainConfig = getDomainConfig()

// SSL redirect middleware helper
export const shouldRedirectToHttps = (request: Request) => {
  const url = new URL(request.url)
  const isHttps = url.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https"

  return domainConfig.FORCE_HTTPS && !isHttps && domainConfig.isProduction
}
