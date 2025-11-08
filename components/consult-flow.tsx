"use client";

import type React from "react";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  fetchEmployeeHours,
  fetchEmployees,
  type EmployeeHoursRecord,
  type EmployeeFromAPI,
} from "@/lib/api-service";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  History,
  Loader2,
  MapPin,
  Search,
  User2,
} from "lucide-react";

type FieldName = "nome" | "matricula";
type ConsultMode = "public" | "dashboard";

const fieldOrder: FieldName[] = ["nome", "matricula"];

const initialFormState: Record<FieldName, string> = {
  nome: "",
  matricula: "",
};

const initialErrors: Record<FieldName, string> = {
  nome: "",
  matricula: "",
};

interface ConsultFlowProps {
  variant?: ConsultMode;
}

export function ConsultFlow({ variant = "public" }: ConsultFlowProps) {
  const router = useRouter();
  const [formData, setFormData] =
    useState<Record<FieldName, string>>(initialFormState);
  const [visibleField, setVisibleField] = useState(0);
  const [errors, setErrors] =
    useState<Record<FieldName, string>>(initialErrors);
  const [status, setStatus] = useState<
    "idle" | "searching" | "success" | "error"
  >("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [records, setRecords] = useState<EmployeeHoursRecord[]>([]);

  // Estado para funcionários (apenas no dashboard)
  const [employees, setEmployees] = useState<EmployeeFromAPI[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Carrega funcionários apenas no dashboard
  useEffect(() => {
    if (variant !== "dashboard") return;

    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, [variant]);

  // Filtra funcionários para autocomplete
  const filteredEmployees = useMemo(() => {
    if (variant !== "dashboard" || !formData.nome) return [];
    const query = formData.nome.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.NOME.toLowerCase().includes(query) || emp.MATRICULA.includes(query)
    );
  }, [formData.nome, employees, variant]);

  const handleSelectEmployee = (employee: EmployeeFromAPI) => {
    setFormData((prev) => ({
      ...prev,
      nome: employee.NOME,
      matricula: employee.MATRICULA,
    }));
    setVisibleField(1); // Move para o próximo campo
  };

  const isFieldVisible = (field: FieldName) =>
    fieldOrder.indexOf(field) <= visibleField;

  const handleChange = (field: FieldName, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setStatus("idle");
    setServerMessage("");
    setRecords([]);

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
    setRecords([]);
  };

  const validate = () => {
    const nextErrors: Record<FieldName, string> = { ...initialErrors };

    if (!formData.nome.trim()) {
      nextErrors.nome = "Informe o nome completo.";
    }
    if (!formData.matricula.trim()) {
      nextErrors.matricula = "Informe a matrícula.";
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("searching");
    setServerMessage("");
    setRecords([]);

    try {
      const payload = {
        nomeCompleto: formData.nome.trim(),
        matricula: formData.matricula.trim(),
        data_nascimento: "", // Campo não coletado no formulário público
      };

      const hoursRecords = await fetchEmployeeHours(payload);

      if (hoursRecords.length === 0) {
        setStatus("error");
        setServerMessage("Funcionário não encontrado. Tente novamente.");
        return;
      }

      const sorted = [...hoursRecords].sort((a, b) => {
        return getRecordTimestamp(b) - getRecordTimestamp(a);
      });

      setRecords(sorted);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setServerMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível consultar no momento."
      );
    }
  };

  const latestRecord = records[0];
  const previousRecords = records.slice(1);

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
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-primary/10" />
      )}
      <div
        className={cn(
          "relative w-full",
          variant === "public" ? "max-w-xl" : "max-w-3xl mx-auto"
        )}
      >
        <Card className="p-6 md:p-8 shadow-xl border border-border/60 bg-card/95 space-y-6">
          {variant === "public" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="gap-2 -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Consultar folha de horas
              </h1>
              <p className="text-sm text-muted-foreground">
                Informe seus dados para validar a folha cadastrada
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
                Matrícula
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

          {status === "success" && latestRecord && (
            <div className="space-y-5 rounded-lg border border-border/80 bg-background/70 p-5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {records.length === 1
                  ? "1 registro encontrado"
                  : `${records.length} registros encontrados`}
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <InfoChip
                  icon={<User2 className="w-4 h-4" />}
                  label="Operador"
                  value={latestRecord.OPERADOR_NOME}
                />
                <InfoChip
                  icon={<MapPin className="w-4 h-4" />}
                  label="Matrícula"
                  value={latestRecord.OPERADOR_MATRICULA}
                />
                <InfoChip
                  icon={<FileText className="w-4 h-4" />}
                  label="Local"
                  value={latestRecord.LOCAL_SERVICO || "-"}
                />
                <InfoChip
                  icon={<Clock className="w-4 h-4" />}
                  label="Registrado em"
                  value={formatDate(
                    latestRecord.createdAt || latestRecord.DATA
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <RecordSection title="Período e Processos">
                  <KeyValueRow
                    label="Data"
                    value={formatDate(latestRecord.DATA)}
                  />
                  <KeyValueRow
                    label="Horário"
                    value={formatHourRange(
                      latestRecord.HORA_INICIAL,
                      latestRecord.HORA_FINAL
                    )}
                  />
                  <KeyValueRow
                    label="Processo"
                    value={latestRecord.PROCESSO || "-"}
                  />
                  <KeyValueRow
                    label="RA / Comunidade"
                    value={`${latestRecord.RA || "-"} ${
                      latestRecord.COMUNIDADE
                        ? `- ${latestRecord.COMUNIDADE}`
                        : ""
                    }`.trim()}
                  />
                </RecordSection>

                <RecordSection title="Horímetros e Serviços">
                  <KeyValueRow
                    label="Horímetro inicial"
                    value={latestRecord.HORIMETRO_INICIAL || "-"}
                  />
                  <KeyValueRow
                    label="Horímetro final"
                    value={latestRecord.HORIMETRO_FINAL || "-"}
                  />
                  <KeyValueRow
                    label="Total do serviço"
                    value={latestRecord.TOTAL_SERVICO || "-"}
                  />
                  <KeyValueRow
                    label="Abastecimento"
                    value={
                      latestRecord.ABASTECIMENTO
                        ? `${latestRecord.ABASTECIMENTO} L`
                        : "-"
                    }
                  />
                </RecordSection>
              </div>

              <RecordSection title="Serviços realizados">
                <div className="flex flex-wrap gap-2">
                  {parseServices(latestRecord.SEVICO_REALIZADO).length === 0 ? (
                    <span className="text-sm text-muted-foreground">-</span>
                  ) : (
                    parseServices(latestRecord.SEVICO_REALIZADO).map(
                      (service) => (
                        <span
                          key={service}
                          className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      )
                    )
                  )}
                </div>
              </RecordSection>

              <RecordSection title="Observações">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {latestRecord.OBSERVACAO?.trim() || "Sem observações"}
                </p>
              </RecordSection>

              {previousRecords.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs uppercase text-muted-foreground">
                    Registros anteriores
                  </p>
                  <div className="space-y-2">
                    {previousRecords.map((record) => (
                      <div
                        key={`${record.id ?? record.createdAt}-${record.DATA}`}
                        className="rounded-md border border-border/70 px-4 py-3 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground">
                              {formatDate(record.DATA)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatHourRange(
                                record.HORA_INICIAL,
                                record.HORA_FINAL
                              )}
                            </p>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            {record.LOCAL_SERVICO || "-"}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-2">
                          {parseServices(record.SEVICO_REALIZADO).map(
                            (service) => (
                              <span
                                key={`${record.id}-${service}`}
                                className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5"
                              >
                                <History className="w-3 h-3" />
                                {service}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
      <div className="text-sm font-semibold text-foreground">
        {value || "-"}
      </div>
    </div>
  );
}

function RecordSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border px-4 py-3 space-y-2 bg-card/70">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function KeyValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">
        {value || "-"}
      </span>
    </div>
  );
}

function parseServices(raw: string) {
  if (!raw) return [];
  return raw
    .split(/[,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value?: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("pt-BR");
}

function formatHourRange(start?: string, end?: string) {
  if (start && end) return `${start} - ${end}`;
  if (end) return end;
  if (start) return start;
  return "-";
}

function getRecordTimestamp(record: EmployeeHoursRecord) {
  const target = record.createdAt || record.updatedAt || record.DATA;
  const parsed = target ? new Date(target).getTime() : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default ConsultFlow;
