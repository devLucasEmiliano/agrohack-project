"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  type Employee,
  addEmployee,
  updateEmployee,
} from "@/lib/employees-data";
import { registerEmployee } from "@/lib/api-service";
import { X, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface EmployeeFormProps {
  employee?: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export default function EmployeeForm({
  employee,
  onSave,
  onCancel,
}: EmployeeFormProps) {
  const [form, setForm] = useState({
    name: employee?.name || "",
    matricula: employee?.matricula || "",
    dataNascimento: employee?.dataNascimento || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.name || !form.matricula || !form.dataNascimento) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      if (employee) {
        // Atualização: apenas atualiza localmente (não envia para API)
        updateEmployee(employee.id, form);
        onSave({ ...employee, ...form });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } else {
        // Cadastro novo: envia para API
        // Transforma data do formato YYYY-MM-DD para DD/MM/YYYY
        const [year, month, day] = form.dataNascimento.split("-");
        const dataFormatada = `${day}/${month}/${year}`;

        const response = await registerEmployee({
          nomeCompleto: form.name,
          matricula: form.matricula,
          data_nascimento: dataFormatada,
        });

        console.log("Funcionário cadastrado na API:", response);

        // Salva também localmente
        const newEmployee = addEmployee(form);
        onSave(newEmployee);
        setSuccess(true);

        // Limpa o formulário após sucesso
        setTimeout(() => {
          setForm({ name: "", matricula: "", dataNascimento: "" });
          setSuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Erro ao salvar funcionário:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao salvar funcionário"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">
          {employee ? "Editar Funcionário" : "Novo Funcionário"}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="hover:bg-muted"
          disabled={loading}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Mensagem de Sucesso */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500 rounded-md">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-400">
            {employee
              ? "Funcionário atualizado com sucesso!"
              : "Funcionário cadastrado com sucesso!"}
          </p>
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive rounded-md">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-destructive">Erro</p>
            <p className="text-sm text-destructive/90">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nome Completo
          </label>
          <Input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome completo do funcionário"
            className="bg-background border-input"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Matrícula
          </label>
          <Input
            type="text"
            value={form.matricula}
            onChange={(e) => setForm({ ...form, matricula: e.target.value })}
            placeholder="Número da matrícula"
            className="bg-background border-input"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Data de Nascimento
          </label>
          <Input
            type="date"
            value={form.dataNascimento}
            onChange={(e) =>
              setForm({ ...form, dataNascimento: e.target.value })
            }
            className="bg-background border-input"
            disabled={loading}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {employee ? "Atualizando..." : "Cadastrando..."}
              </>
            ) : (
              "Salvar"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 bg-transparent"
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
