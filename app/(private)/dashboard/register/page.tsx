"use client"

import { useState } from "react"
import { ChatBot } from "@/components/chat-bot"
import { ConfirmationPage } from "@/components/confirmation-page"
import type { FormData } from "@/components/chat-bot"

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-accent/10 border border-accent rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Registro Enviado!</h2>
            <p className="text-muted-foreground mb-4">Suas horas foram registradas com sucesso</p>
            <button
              onClick={() => {
                setFormData(null)
                setSubmitted(false)
              }}
              className="px-6 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-md transition-colors"
            >
              Novo Registro
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (formData) {
    return <ConfirmationPage data={formData} onSubmit={() => setSubmitted(true)} onEdit={() => setFormData(null)} />
  }

  return <ChatBot onSubmit={setFormData} />
}
