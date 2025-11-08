"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldName =
  | "fullName"
  | "email"
  | "confirmEmail"
  | "password"
  | "confirmPassword";

const fieldOrder: FieldName[] = [
  "fullName",
  "email",
  "confirmEmail",
  "password",
  "confirmPassword",
];

const initialFormState: Record<FieldName, string> = {
  fullName: "",
  email: "",
  confirmEmail: "",
  password: "",
  confirmPassword: "",
};

const registerEndpoint =
  process.env.NEXT_PUBLIC_REGISTER_ENV || process.env.REGISTER_ENV || "";

const AnimatedField = ({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "transition-all duration-500 ease-out overflow-hidden",
      isVisible
        ? "opacity-100 translate-y-0 mt-4"
        : "opacity-0 -translate-y-2 mt-0 pointer-events-none"
    )}
    style={{ maxHeight: isVisible ? 320 : 0 }}
    aria-hidden={!isVisible}
  >
    <div className="space-y-2">{children}</div>
  </div>
);

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<FieldName, string>>({
    ...initialFormState,
  });
  const [unlockedFieldIndex, setUnlockedFieldIndex] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isFieldVisible = (field: FieldName) => {
    const fieldIndex = fieldOrder.indexOf(field);
    if (fieldIndex === -1) {
      return true;
    }
    return unlockedFieldIndex >= fieldIndex;
  };

  const isFormReady = Boolean(
    formData.fullName.trim() &&
      formData.email.trim() &&
      formData.confirmEmail.trim() &&
      formData.password &&
      formData.confirmPassword
  );

  const fieldVisibility: Record<FieldName, boolean> = {
    fullName: isFieldVisible("fullName"),
    email: isFieldVisible("email"),
    confirmEmail: isFieldVisible("confirmEmail"),
    password: isFieldVisible("password"),
    confirmPassword: isFieldVisible("confirmPassword"),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as FieldName;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    const fieldIndex = fieldOrder.indexOf(fieldName);
    if (fieldIndex > -1 && value.trim().length > 0) {
      setUnlockedFieldIndex((prev) =>
        Math.max(prev, Math.min(fieldOrder.length - 1, fieldIndex + 1))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.confirmEmail.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Preencha todos os campos.");
      return;
    }

    if (
      formData.email.trim().toLowerCase() !==
      formData.confirmEmail.trim().toLowerCase()
    ) {
      setError("Os e-mails não coincidem.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (!registerEndpoint) {
      setError("Endpoint de registro não configurado.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nomeCompleto: formData.fullName.trim(),
        email: formData.email.trim(),
        senha: formData.password,
      };

      const response = await fetch(registerEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = "Não foi possível concluir o cadastro.";
        try {
          const errorResponse = await response.json();
          message = errorResponse?.message ?? errorResponse?.error ?? message;
        } catch {
          // ignore parse errors
        }
        throw new Error(message);
      }

      setSuccess("Cadastro enviado com sucesso! Redirecionando...");
      setFormData({ ...initialFormState });
      setUnlockedFieldIndex(0);

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Registro de Horas
          </h1>
          <p className="text-muted-foreground">
            Sistema de Gerenciamento Agrícola
          </p>
        </div>

        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle>Crie sua Conta</CardTitle>
            <CardDescription>
              Cadastre-se para começar a registrar suas horas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col">
              {error && (
                <div
                  className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div
                  className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-600 text-sm mt-3"
                  role="status"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <AnimatedField isVisible={fieldVisibility.fullName}>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground"
                >
                  Nome Completo
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  disabled={!fieldVisibility.fullName}
                  className="w-full"
                />
              </AnimatedField>

              <AnimatedField isVisible={fieldVisibility.email}>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  disabled={!fieldVisibility.email}
                  className="w-full"
                />
              </AnimatedField>

              <AnimatedField isVisible={fieldVisibility.confirmEmail}>
                <label
                  htmlFor="confirmEmail"
                  className="block text-sm font-medium text-foreground"
                >
                  Confirmar Email
                </label>
                <Input
                  id="confirmEmail"
                  type="email"
                  placeholder="Digite o email novamente"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  disabled={!fieldVisibility.confirmEmail}
                  className="w-full"
                />
              </AnimatedField>

              <AnimatedField isVisible={fieldVisibility.password}>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  disabled={!fieldVisibility.password}
                  className="w-full"
                />
              </AnimatedField>

              <AnimatedField isVisible={fieldVisibility.confirmPassword}>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground"
                >
                  Confirmar Senha
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  disabled={!fieldVisibility.confirmPassword}
                  className="w-full"
                />
              </AnimatedField>

              <Button
                type="submit"
                disabled={loading || !isFormReady}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
              >
                {loading ? "Enviando cadastro..." : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:underline font-medium"
              >
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
