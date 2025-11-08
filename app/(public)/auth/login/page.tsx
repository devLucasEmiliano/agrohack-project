"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

const loginEndpoint = process.env.NEXT_PUBLIC_LOGIN_ENV || process.env.LOGIN_ENV || ""

const buildUserProfile = (userEmail: string) => {
  const trimmedEmail = userEmail.trim()
  const extractedName = trimmedEmail.split("@")[0] || "Usuário"

  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    name: extractedName,
    email: trimmedEmail,
    createdAt: new Date().toISOString(),
  }
}

const persistSession = (user: ReturnType<typeof buildUserProfile>) => {
  localStorage.setItem("currentUser", JSON.stringify(user))

  if (typeof document !== "undefined") {
    const cookieValue = encodeURIComponent(
      JSON.stringify({
        email: user.email,
        loggedInAt: user.createdAt,
      }),
    )
    document.cookie = `currentUser=${cookieValue}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isFormValid = Boolean(email.trim() && password)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!loginEndpoint) {
      setError("Endpoint de login não configurado.")
      return
    }

    if (!isFormValid) {
      setError("Informe email e senha.")
      return
    }

    setLoading(true)

    try {
      const payload = {
        email: email.trim(),
        senha: password,
      }

      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Não foi possível processar o login.")
      }

      const data: { login?: string | boolean } = await response.json().catch(() => ({}))
      const loginStatus = String(data?.login ?? "").toLowerCase()

      if (loginStatus !== "true") {
        setError("Email ou senha inválidos.")
        return
      }

      const authenticatedUser = buildUserProfile(email)
      persistSession(authenticatedUser)

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Registro de Horas</h1>
          <p className="text-muted-foreground">Sistema de Gerenciamento Agrícola</p>
        </div>

        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle>Faça seu Login</CardTitle>
            <CardDescription>Entre com suas credenciais para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Não tem conta?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
