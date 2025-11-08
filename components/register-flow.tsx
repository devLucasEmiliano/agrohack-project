"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatBot, { type FormData } from "@/components/chat-bot";
import ConfirmationPage from "@/components/confirmation-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

type RegisterMode = "dashboard" | "public";

interface RegisterFlowProps {
  mode?: RegisterMode;
}

export function RegisterFlow({ mode = "dashboard" }: RegisterFlowProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleChatbotSubmit = (data: FormData) => {
    setFormData(data);
  };

  const handleConfirmationSubmit = () => {
    if (mode === "dashboard") {
      setCompleted(true);
    } else {
      router.push("/");
    }
  };

  const handleRestart = () => {
    setFormData(null);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-accent/10 border border-accent rounded-lg p-8 text-center space-y-4 shadow-sm">
            <div className="flex justify-center">
              <div className="rounded-full bg-accent/20 p-4">
                <CheckCircle2 className="w-10 h-10 text-accent-foreground" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Registro enviado com sucesso
              </h2>
              <p className="text-muted-foreground">
                Seus dados foram salvos e ficarao disponiveis no dashboard
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleRestart}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Novo registro
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Voltar para home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (formData) {
    return (
      <ConfirmationPage
        data={formData}
        onSubmit={handleConfirmationSubmit}
        onEdit={() => setFormData(null)}
      />
    );
  }

  return <ChatBot onSubmit={handleChatbotSubmit} mode={mode} />;
}

export default RegisterFlow;
