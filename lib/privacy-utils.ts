export interface PrivacySettings {
  noPII: boolean
  anonymize: boolean
  allowAnalytics: boolean
  loggingEnabled: boolean
}

export function getPrivacySettings(area: string): PrivacySettings {
  if (typeof window === "undefined") {
    return { noPII: true, anonymize: true, allowAnalytics: false, loggingEnabled: false }
  }

  return {
    noPII: localStorage.getItem(`privacy-no-pii-${area}`) === "true",
    anonymize: localStorage.getItem(`privacy-anonymize-${area}`) === "true",
    allowAnalytics: localStorage.getItem(`privacy-analytics-${area}`) === "true",
    loggingEnabled: localStorage.getItem(`privacy-logging-${area}`) === "true",
  }
}

export function maskPII(data: any, settings: PrivacySettings): any {
  if (!settings.noPII && !settings.anonymize) return data

  const masked = JSON.parse(JSON.stringify(data))

  const piiFields = ["name", "email", "phone", "address", "id", "userId", "username"]

  function maskObject(obj: any): any {
    if (typeof obj !== "object" || obj === null) return obj

    for (const key in obj) {
      if (piiFields.some((field) => key.toLowerCase().includes(field))) {
        obj[key] = "***"
      } else if (typeof obj[key] === "object") {
        obj[key] = maskObject(obj[key])
      } else if (typeof obj[key] === "string" && settings.anonymize) {
        // Simple anonymization for demo purposes
        obj[key] = obj[key].replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "***@***.***")
      }
    }
    return obj
  }

  return maskObject(masked)
}

export function logPrivacyCompliantRequest(area: string, endpoint: string, data: any) {
  const settings = getPrivacySettings(area)
  const maskedData = maskPII(data, settings)

  if (settings.loggingEnabled) {
    console.log(`[v0] Privacy-compliant request to ${endpoint}:`, maskedData)
  } else {
    console.log(`[v0] Request to ${endpoint} - logging disabled by user privacy settings`)
  }
}
