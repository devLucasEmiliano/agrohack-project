"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import ChatBot from "@/components/chat-bot"
import type { FormData } from "@/components/chat-bot"
import ConfirmationPage from "@/components/confirmation-page"

export default function RegisterPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<"chat" | "confirmation">("chat")
  const [formData, setFormData] = useState<FormData | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const handleSubmit = (data: FormData) => {
    setFormData(data)
    setStep("confirmation")
  }

  const handleConfirmationSubmit = () => {
    const records = JSON.parse(localStorage.getItem("workHoursRecords") || "[]")
    records.push({
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem("workHoursRecords", JSON.stringify(records))
    router.push("/dashboard")
  }

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

  return (
    <>
      {step === "chat" ? (
        <ChatBot onSubmit={handleSubmit} />
      ) : (
        <ConfirmationPage data={formData!} onSubmit={handleConfirmationSubmit} onEdit={() => setStep("chat")} />
      )}
    </>
  )
}
