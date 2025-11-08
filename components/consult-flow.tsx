"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getEmployees, type Employee } from "@/lib/employees-data";
import {
  getTimesheetByEmployee,
  type TimesheetEntry,
} from "@/lib/timesheet-data";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Search,
  User2,
} from "lucide-react";

type FieldName = "nome" | "matricula" | "dataNascimento";
type ConsultMode = "public" | "dashboard";

const fieldOrder: FieldName[] = ["nome", "matricula", "dataNascimento"];

const initialFormState: Record<FieldName, string> = {
  nome: "",
  matricula: "",
  dataNascimento: "",
};

const initialErrors: Record<FieldName, string> = {
  nome: "",
  matricula: "",
  dataNascimento: "",
};

interface ConsultFlowProps {
  variant?: ConsultMode;
}

export function ConsultFlow({ variant = "public" }: ConsultFlowProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] =
    useState<Record<FieldName, string>>(initialFormState);
  const [visibleField, setVisibleField] = useState(0);
  const [errors, setErrors] =
    useState<Record<FieldName, string>>(initialErrors);
  const [status, setStatus] = useState<"idle" | "searching" | "success" | "error">(
    "idle"
  );
  const [serverMessage, setServerMessage] = useState("");
  const [result, setResult] = useState<{
    employee: Employee;
    entries: TimesheetEntry[];
  } | null>(null);

  const isFieldVisible = (field: FieldName) =>
    fieldOrder.indexOf(field) <= visibleField;

  const handleChange = (field: FieldName, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setStatus("idle");
    setServerMessage("");
    setResult(null);

    const fieldIndex = fieldOrder.indexOf(field);
    if (value.trim().length > 1) {
      setVisibleField((prevVisible) =>
        Math.max(prevVisible, Math.min(fieldOrder.length - 1, fieldIndex + 1))
      );
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors(initialErrors);
    setVisibleField(0);
    setStatus("idle");
    setServerMessage("");
    setResult(null);
  };

  const validate = () => {
    const nextErrors: Record<FieldName, string> = { ...initialErrors };

    if (!formData.nome.trim()) {
      nextErrors.nome = "Informe o nome completo.";
    }
    if (!formData.matricula.trim()) {
      nextErrors.matricula = "Informe a matricula.";
    }
    if (!formData.dataNascimento.trim()) {
      nextErrors.dataNascimento = "Selecione a data de nascimento.";
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("searching");
    setServerMessage("");
    setResult(null);

    setTimeout(() => {
      if (variant === "public" && !user) {
        setStatus("error");
        setServerMessage("Funcionario nao encontrado. Tente novamente.");
        return;
      }

      const employees = getEmployees();
      const normalizedName = formData.nome.trim().toLowerCase();
      const match = employees.find(
        (emp) =>
          emp.name.trim().toLowerCase() === normalizedName &&
          emp.matricula.trim() === formData.matricula.trim() &&
          emp.dataNascimento === formData.dataNascimento
      );

      if (!match) {
        setStatus("error");
        setServerMessage("Funcionario nao encontrado. Tente novamente.");
        return;
      }

      const entries = getTimesheetByEmployee(match.id);
      if (entries.length === 0) {
        setStatus("error");
        setServerMessage("Nenhum registro encontrado para esta combinacao.");
        return;
      }

      setStatus("success");
      setResult({ employee: match, entries });
    }, 350);
  };

  const recentEntries =
    result?.entries.slice(-3).reverse() ?? ([] as TimesheetEntry[]);
  const totalHours = result
    ? result.entries.reduce((sum, entry) => sum + entry.hoursWorked, 0)
    : 0;
  const lastEntry =
    result && result.entries.length > 0
      ? result.entries[result.entries.length - 1]
      : null;

  const loginRedirect = () =>
    router.push("/auth/login?redirect=/dashboard/consult");

  const dashboardRedirect = () => router.push("/dashboard/timesheet");

  return (
    <div
      className={cn(
        "relative",
        variant === "public"
          ? "min-h-screen flex items-center justify-center px-4 py-12"
          : "w-full"
      )}
    >
      {variant === "public" && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/10" />
      )}
      <div
        className={cn(
          "relative w-full",
          variant === "public" ? "max-w-xl" : "max-w-3xl mx-auto"
        )}
      >
        <Card className="p-6 md:p-8 shadow-xl border border-border/60 bg-card/95 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Consultar folha de horas
              </h1>
              <p className="text-sm text-muted-foreground">
                Informe seus dados para validar a folha cadastrada no dashboard
              </p>
            </div>

            <AnimatedField isVisible>
              <label className="text-sm font-medium text-foreground">
                Nome completo
              </label>
              <Input
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Digite o nome que consta no cadastro"
              />
              {errors.nome && (
                <p className="text-xs text-destructive">{errors.nome}</p>
              )}
            </AnimatedField>

            <AnimatedField isVisible={isFieldVisible("matricula")}>
              <label className="text-sm font-medium text-foreground">
                Matricula
              </label>
              <Input
                value={formData.matricula}
                onChange={(e) => handleChange("matricula", e.target.value)}
                placeholder="000123"
              />
              {errors.matricula && (
                <p className="text-xs text-destructive">{errors.matricula}</p>
              )}
            </AnimatedField>

            <AnimatedField isVisible={isFieldVisible("dataNascimento")}>
              <label className="text-sm font-medium text-foreground">
                Data de nascimento
              </label>
              <Input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleChange("dataNascimento", e.target.value)}
              />
              {errors.dataNascimento && (
                <p className="text-xs text-destructive">
                  {errors.dataNascimento}
                </p>
              )}
            </AnimatedField>

            <Button
              type="submit"
              disabled={status === "searching"}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              {status === "searching" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validando dados
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Consultar
                </>
              )}
            </Button>
          </form>

          {status === "error" && serverMessage && (
            <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <div className="space-y-2">
                <p>{serverMessage}</p>
                {variant === "public" && (
                  <Button
                    variant="link"
                    className="px-0 text-destructive underline-offset-4"
                    onClick={loginRedirect}
                  >
                    Acessar dashboard para consultar
                  </Button>
                )}
              </div>
            </div>
          )}

          {status === "success" && result && (
            <div className="space-y-4 rounded-lg border border-border/80 bg-background/70 p-5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Registros encontrados
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <InfoChip
                  icon={<User2 className="w-4 h-4" />}
                  label="Funcionario"
                  value={result.employee.name}
                />
                <InfoChip
                  icon={<MapPin className="w-4 h-4" />}
                  label="Matricula"
                  value={result.employee.matricula}
                />
                <InfoChip
                  icon={<CalendarDays className="w-4 h-4" />}
                  label="Cadastro"
                  value={new Date(
                    result.employee.createdAt
                  ).toLocaleDateString("pt-BR")}
                />
                <InfoChip
                  icon={<Clock className="w-4 h-4" />}
                  label="Total de horas"
                  value={`${totalHours.toFixed(1)}h`}
                />
              </div>

              {lastEntry && (
                <div className="rounded-md border border-border px-4 py-3 text-sm">
                  <p className="text-xs uppercase text-muted-foreground mb-1">
                    Ultimo registro
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span>
                      {new Date(lastEntry.date).toLocaleDateString("pt-BR")}
                    </span>
                    <span>
                      {lastEntry.startTime} - {lastEntry.endTime}
                    </span>
                    <span>{lastEntry.activity}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs uppercase text-muted-foreground">
                  Ultimos registros
                </p>
                <div className="space-y-2">
                  {recentEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-md border border-border/70 px-4 py-2 text-sm flex flex-wrap gap-3 justify-between"
                    >
                      <span className="font-medium text-foreground">
                        {entry.activity}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="text-muted-foreground">
                        {entry.hoursWorked.toFixed(1)}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetForm}
                >
                  Nova consulta
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={
                    variant === "public" ? loginRedirect : dashboardRedirect
                  }
                >
                  Abrir dashboard
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function AnimatedField({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 h-auto"
          : "opacity-0 -translate-y-2 h-0 overflow-hidden"
      )}
    >
      <div className="space-y-2 mt-1">{children}</div>
    </div>
  );
}

function InfoChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export default ConsultFlow;
