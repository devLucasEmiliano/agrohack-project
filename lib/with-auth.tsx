"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "./auth-context"

export function withAuth<P extends object>(Component: React.ComponentType<P>): React.ComponentType<P> {
  return function ProtectedComponent(props: P) {
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
      if (!loading && !user) {
        router.push("/auth/login")
      }
    }, [user, loading, router])

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-2"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      )
    }

    if (!user) {
      return null
    }

    return <Component {...props} />
  }
}
