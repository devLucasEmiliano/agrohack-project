"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Employee } from "@/lib/employees-data";
import type { TimesheetEntry } from "@/lib/timesheet-data";
import { cn } from "@/lib/utils";

const WEEK_DAYS = [
  { label: "Segunda-feira", value: 1 },
  { label: "Terça-feira", value: 2 },
  { label: "Quarta-feira", value: 3 },
  { label: "Quinta-feira", value: 4 },
  { label: "Sexta-feira", value: 5 },
  { label: "Sábado", value: 6 },
  { label: "Domingo", value: 0 },
];

interface TimesheetModuleProps {
  employee: Employee;
  entries: TimesheetEntry[];
  className?: string;
}

export function TimesheetModule({
  employee,
  entries,
  className,
}: TimesheetModuleProps) {
  const orderedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalHours = entries.reduce(
    (sum, entry) => sum + entry.hoursWorked,
    0
  );
  const location =
    orderedEntries[orderedEntries.length - 1]?.location || "Não informado";
  const period =
    orderedEntries.length > 0
      ? `${formatDate(orderedEntries[0].date)} a ${formatDate(
          orderedEntries[orderedEntries.length - 1].date
        )}`
      : "Sem registros";
  const observations =
    entries
      .map((entry) => entry.notes?.trim())
      .filter(Boolean)
      .join("\n") || "Sem observações registradas.";

  const dailyRows = WEEK_DAYS.map((day) => {
    const dayEntries = orderedEntries.filter((entry) => {
      const dayOfWeek = getDay(entry.date);
      return dayOfWeek === day.value;
    });

    if (dayEntries.length === 0) {
      return {
        label: capitalize(day.label),
        startTime: "-",
        endTime: "-",
        hours: "-",
        codes: "-",
        description: "-",
      };
    }

    const startTime = dayEntries[0].startTime || "-";
    const endTime = dayEntries[dayEntries.length - 1].endTime || "-";
    const hoursValue = dayEntries.reduce(
      (sum, entry) => sum + entry.hoursWorked,
      0
    );
    const codes = Array.from(
      new Set(
        dayEntries
          .map((entry) => generateServiceCode(entry.activity))
          .filter(Boolean)
      )
    ).join(", ");
    const description = Array.from(
      new Set(dayEntries.map((entry) => entry.activity))
    ).join("; ");

    return {
      label: capitalize(day.label),
      startTime,
      endTime,
      hours: hoursValue > 0 ? `${hoursValue.toFixed(1)}h` : "-",
      codes: codes || "-",
      description: description || "-",
    };
  });

  return (
    <Card
      className={cn(
        "border-2 border-border shadow-sm print:shadow-none",
        className
      )}
    >
      <CardHeader className="border-b border-border pb-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-[1.3fr,0.7fr]">
          <div className="border border-border rounded-md p-4 text-center text-[11px] uppercase leading-tight tracking-tight space-y-1">
            <p>Governo do Distrito Federal</p>
            <p>Secretaria de Estado de Agricultura Abastecimento</p>
            <p>Desenvolvimento Rural</p>
            <p>Subsecretaria de Desenvolvimento Rural</p>
            <p>Diretoria de Mecanização Agrícola</p>
            <p className="text-sm font-semibold mt-3">
              Registro de Horas Trabalhadas
            </p>
          </div>
          <div className="border border-border rounded-md text-[11px] uppercase">
            <HeaderField label="Nº RHT" value={employee.matricula || "-"} />
            <HeaderField label="Prefixo de Máquina/marca" value="-" />
            <HeaderField label="Implemento 01/marca" value="-" />
            <HeaderField label="Implemento 02/marca/modelo" value="-" />
            <HeaderField label="Implemento 03/marca/modelo" value="-" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm uppercase font-semibold text-foreground">
          <span>{`Funcionário: ${employee.name}`}</span>
          <span>{`Matrícula: ${employee.matricula}`}</span>
          <span>{`Total acumulado: ${totalHours.toFixed(1)}h`}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="border border-border rounded-md divide-y divide-border text-sm bg-card">
          <MetaField label="Local" value={location} />
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <MetaField label="Processo SEI nº" value="-" />
            <MetaField label="Polo Rural" value="-" />
          </div>
          <MetaField label="Período de" value={period} />
        </div>

        <div className="border border-border rounded-md overflow-hidden">
          <div className="grid grid-cols-[130px,110px,110px,130px,150px,1fr] bg-muted text-[11px] uppercase font-semibold text-muted-foreground">
            <div className="px-3 py-2 border-r border-border">Dia da semana</div>
            <div className="px-3 py-2 border-r border-border">Início</div>
            <div className="px-3 py-2 border-r border-border">Término</div>
            <div className="px-3 py-2 border-r border-border">
              Qt. Hora máq
            </div>
            <div className="px-3 py-2 border-r border-border">Cód. Serviço</div>
            <div className="px-3 py-2">Descrição do serviço</div>
          </div>
          {dailyRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[130px,110px,110px,130px,150px,1fr] border-t border-border text-sm"
            >
              <div className="px-3 py-3 border-r border-border font-semibold uppercase text-foreground">
                <p>{row.label}</p>
              </div>
              <div className="px-3 py-3 border-r border-border">
                <p className="font-medium">{row.startTime}</p>
                <p className="text-[11px] text-muted-foreground">
                  Horímetro início: -
                </p>
              </div>
              <div className="px-3 py-3 border-r border-border">
                <p className="font-medium">{row.endTime}</p>
                <p className="text-[11px] text-muted-foreground">
                  Horímetro fim: -
                </p>
              </div>
              <div className="px-3 py-3 border-r border-border font-medium">
                {row.hours}
              </div>
              <div className="px-3 py-3 border-r border-border text-sm">
                {row.codes}
              </div>
              <div className="px-3 py-3 text-sm">{row.description}</div>
            </div>
          ))}
        </div>

        <div className="border border-border rounded-md grid md:grid-cols-[1.5fr,1fr] text-sm">
          <div className="px-3 py-3 border-b md:border-b-0 md:border-r border-border font-semibold uppercase">
            Total horas
          </div>
          <div className="px-3 py-3 text-2xl font-bold text-foreground">
            {totalHours.toFixed(1)}h
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <SignatureField
            leftLabel="Nome do Produtor Rural"
            leftValue={employee.name || "-"}
            rightLabel="Assinatura/CPF do Produtor Rural"
          />
          <SignatureField
            leftLabel="Nome e Matrícula do Operador"
            leftValue={`${employee.name} - ${employee.matricula}`}
            rightLabel="Assinatura do Operador"
          />
          <SignatureField
            leftLabel="Nome e Matrícula do Encarregado de Campo"
            rightLabel="Assinatura do Encarregado de Campo"
          />
        </div>

        <div className="border border-border rounded-md">
          <div className="px-3 py-2 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
            Observações
          </div>
          <div className="px-3 py-4 min-h-[80px] text-sm whitespace-pre-wrap">
            {observations}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("pt-BR");
}

function getDay(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.getDay();
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function generateServiceCode(activity: string) {
  if (!activity) return "";
  return activity
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 4);
}

function HeaderField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-border last:border-b-0">
      <div className="flex-1 px-3 py-2 font-semibold tracking-tight text-foreground">
        {label}
      </div>
      <div className="flex-1 px-3 py-2 border-l border-border text-foreground">
        {value || "-"}
      </div>
    </div>
  );
}

function MetaField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="px-3 py-2 bg-background">
      <div className="text-[11px] uppercase text-muted-foreground tracking-tight">
        {label}
      </div>
      <div className="text-sm font-semibold text-foreground mt-1 min-h-[20px]">
        {value || "-"}
      </div>
    </div>
  );
}

function SignatureField({
  leftLabel,
  leftValue,
  rightLabel,
}: {
  leftLabel: string;
  leftValue?: string;
  rightLabel: string;
}) {
  return (
    <div className="border border-border rounded-md divide-y divide-border">
      <div className="px-3 py-2">
        <p className="text-xs uppercase text-muted-foreground">{leftLabel}</p>
        <p className="border-t border-dashed border-border mt-2 pt-2 text-sm font-medium min-h-[28px]">
          {leftValue || ""}
        </p>
      </div>
      <div className="px-3 py-2">
        <p className="text-xs uppercase text-muted-foreground">{rightLabel}</p>
        <div className="border-t border-dashed border-border mt-2 pt-6" />
      </div>
    </div>
  );
}

export default TimesheetModule;
