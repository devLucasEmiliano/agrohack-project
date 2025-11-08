"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search } from "lucide-react";

export default function ConsultaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    dataNascimento: "",
  });
  const [errors, setErrors] = useState({
    nome: "",
    matricula: "",
    dataNascimento: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors = {
      nome: "",
      matricula: "",
      dataNascimento: "",
    };

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.matricula.trim()) {
      newErrors.matricula = "Matrícula é obrigatória";
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
    }

    setErrors(newErrors);

    // If no errors, proceed
    if (!newErrors.nome && !newErrors.matricula && !newErrors.dataNascimento) {
      // Store search params and redirect to history page
      const searchParams = new URLSearchParams({
        nome: formData.nome,
        matricula: formData.matricula,
        dataNascimento: formData.dataNascimento,
      });
      router.push(`/history?${searchParams.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              RH
            </div>
            <h1 className="font-semibold text-foreground">
              Consultar Folha de Horas
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Search className="w-6 h-6" />
              Dados para Consulta
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Informe seus dados para consultar sua folha de horas trabalhadas
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className={errors.nome ? "border-destructive" : ""}
                />
                {errors.nome && (
                  <p className="text-sm text-destructive">{errors.nome}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  type="text"
                  placeholder="Digite sua matrícula"
                  value={formData.matricula}
                  onChange={(e) =>
                    setFormData({ ...formData, matricula: e.target.value })
                  }
                  className={errors.matricula ? "border-destructive" : ""}
                />
                {errors.matricula && (
                  <p className="text-sm text-destructive">{errors.matricula}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) =>
                    setFormData({ ...formData, dataNascimento: e.target.value })
                  }
                  className={errors.dataNascimento ? "border-destructive" : ""}
                />
                {errors.dataNascimento && (
                  <p className="text-sm text-destructive">
                    {errors.dataNascimento}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  <Search className="w-4 h-4 mr-2" />
                  Consultar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> Os dados informados serão utilizados apenas
              para consulta da sua folha de horas. Certifique-se de que as
              informações estejam corretas.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
