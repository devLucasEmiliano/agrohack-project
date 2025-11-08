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
    const records = JSON.parse(
      localStorage.getItem("workHoursRecords") || "[]"
    );
    records.push({
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("workHoursRecords", JSON.stringify(records));
    router.push("/dashboard");
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
