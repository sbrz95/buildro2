// Privacy-friendly performance monitoring utilities
export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timestamp: string
}

// Collect Web Vitals without PII
export function collectWebVitals(): Promise<PerformanceMetrics | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null)
      return
    }

    // Wait for page to load
    if (document.readyState === "loading") {
      window.addEventListener("load", () => collectMetrics(resolve))
    } else {
      collectMetrics(resolve)
    }
  })
}

function collectMetrics(resolve: (metrics: PerformanceMetrics | null) => void) {
  try {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType("paint")

    const fcp = paint.find((entry) => entry.name === "first-contentful-paint")

    // Basic metrics without any user-identifying information
    const metrics: PerformanceMetrics = {
      pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      firstContentfulPaint: fcp?.startTime || 0,
      largestContentfulPaint: 0, // Will be updated by observer
      cumulativeLayoutShift: 0, // Will be updated by observer
      firstInputDelay: 0, // Will be updated by observer
      timestamp: new Date().toISOString(),
    }

    // Observe LCP
    if ("PerformanceObserver" in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        metrics.largestContentfulPaint = lastEntry.startTime
      })
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })

      // Observe CLS
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        metrics.cumulativeLayoutShift = clsValue
      })
      clsObserver.observe({ type: "layout-shift", buffered: true })

      // Observe FID
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          metrics.firstInputDelay = entry.processingStart - entry.startTime
        }
      })
      fidObserver.observe({ type: "first-input", buffered: true })
    }

    resolve(metrics)
  } catch (error) {
    console.error("[v0] Error collecting performance metrics:", error)
    resolve(null)
  }
}

// Log performance metrics in a privacy-compliant way
export function logPerformanceMetrics(metrics: PerformanceMetrics) {
  // Only log if user has opted in to analytics
  const allowAnalytics = localStorage.getItem("privacy-analytics-global") === "true"

  if (!allowAnalytics) {
    return
  }

  console.log("[v0] Performance metrics:", {
    pageLoadTime: Math.round(metrics.pageLoadTime),
    fcp: Math.round(metrics.firstContentfulPaint),
    lcp: Math.round(metrics.largestContentfulPaint),
    cls: metrics.cumulativeLayoutShift.toFixed(3),
    fid: Math.round(metrics.firstInputDelay),
    timestamp: metrics.timestamp,
  })
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === "undefined") return

  // Collect metrics after page load
  collectWebVitals().then((metrics) => {
    if (metrics) {
      logPerformanceMetrics(metrics)
    }
  })
}
