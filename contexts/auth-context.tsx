"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  company?: string
  plan: "starter" | "pro" | "custom"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  company?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem("buildro_logged_in") === "true"
        const userData = localStorage.getItem("buildro_user")

        if (isLoggedIn && userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        // Clear invalid data
        localStorage.removeItem("buildro_logged_in")
        localStorage.removeItem("buildro_user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          company: data.user.company,
          plan: data.user.plan,
          createdAt: data.user.createdAt || new Date().toISOString(),
        }

        setUser(userData)
        localStorage.setItem("buildro_logged_in", "true")
        localStorage.setItem("buildro_user", JSON.stringify(userData))
        localStorage.setItem("buildro_token", data.token)

        const redirectUrl = sessionStorage.getItem("redirectAfterLogin")
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin")
          window.location.href = redirectUrl
        }

        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: "Netzwerkfehler. Bitte versuchen Sie es erneut." }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        const newUser: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          company: data.user.company,
          plan: data.user.plan,
          createdAt: data.user.createdAt,
        }

        setUser(newUser)
        localStorage.setItem("buildro_logged_in", "true")
        localStorage.setItem("buildro_user", JSON.stringify(newUser))
        localStorage.setItem("buildro_token", data.token)

        const redirectUrl = sessionStorage.getItem("redirectAfterLogin")
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin")
          window.location.href = redirectUrl
        }

        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: "Netzwerkfehler. Bitte versuchen Sie es erneut." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("buildro_logged_in")
    localStorage.removeItem("buildro_user")
    localStorage.removeItem("buildro_token")
    sessionStorage.removeItem("redirectAfterLogin")
    window.location.href = "/"
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("buildro_user", JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
