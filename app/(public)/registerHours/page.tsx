"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ChatBot from "@/components/chat-bot";
import type { FormData } from "@/components/chat-bot";
import ConfirmationPage from "@/components/confirmation-page";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"chat" | "confirmation">("chat");
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleSubmit = (data: FormData) => {
    setFormData(data);
    setStep("confirmation");
  };

  const handleConfirmationSubmit = () => {
    // Redireciona para a home após sucesso
    router.push("/");
  };

  return (
    <>
      {step === "chat" ? (
        <ChatBot onSubmit={handleSubmit} />
      ) : (
        <ConfirmationPage
          data={formData!}
          onSubmit={handleConfirmationSubmit}
          onEdit={() => setStep("chat")}
        />
      )}
    </>
  );
}
