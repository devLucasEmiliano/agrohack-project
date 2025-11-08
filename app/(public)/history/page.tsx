"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface PublicRecord {
  id: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [registros] = useState<PublicRecord[]>([]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Histórico de Registros
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            Voltar para Home
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {registros.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum registro encontrado
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push("/registerHours")}>
                Fazer Primeiro Registro
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Voltar para Home
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">{/* Registros aqui */}</div>
        )}
      </div>
    </div>
  );
}
