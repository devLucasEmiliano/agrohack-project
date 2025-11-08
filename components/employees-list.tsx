"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  type Employee,
  getEmployees,
  deleteEmployee,
  saveEmployees,
} from "@/lib/employees-data";
import { fetchEmployees, type EmployeeFromAPI } from "@/lib/api-service";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface EmployeesListProps {
  onEdit: (employee: Employee) => void;
  onAdd: () => void;
}

export default function EmployeesList({ onEdit, onAdd }: EmployeesListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para transformar funcionário da API para o formato local
  const transformAPIEmployee = (apiEmployee: EmployeeFromAPI): Employee => {
    // Transforma data de DD/MM/YYYY para YYYY-MM-DD
    const [day, month, year] = apiEmployee.DATA_NASCIMENTO.split("/");
    const dataNascimento = `${year}-${month}-${day}`;

    return {
      id: apiEmployee.id.toString(),
      name: apiEmployee.NOME,
      matricula: apiEmployee.MATRICULA,
      dataNascimento,
      createdAt: apiEmployee.createdAt,
    };
  };

  // Função para carregar funcionários da API
  const loadEmployees = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiEmployees = await fetchEmployees();
      const transformedEmployees = apiEmployees.map(transformAPIEmployee);

      // Atualiza estado
      setEmployees(transformedEmployees);

      // Sincroniza com localStorage
      saveEmployees(transformedEmployees);

      console.log(
        `${transformedEmployees.length} funcionário(s) carregado(s) da API`
      );
    } catch (err) {
      console.error("Erro ao carregar funcionários:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar funcionários da API"
      );

      // Em caso de erro, tenta carregar do localStorage
      const localEmployees = getEmployees();
      if (localEmployees.length > 0) {
        setEmployees(localEmployees);
        console.log(
          `${localEmployees.length} funcionário(s) carregado(s) do localStorage (fallback)`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Carrega funcionários ao montar o componente
  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Deseja deletar este funcionário?")) {
      deleteEmployee(id);
      setEmployees(getEmployees());
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.matricula.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Buscar por nome ou matrícula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={onAdd}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Novo
        </Button>
      </div>

      <div className="grid gap-3">
        {filtered.map((employee) => (
          <Card key={employee.id} className="p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Matrícula: {employee.matricula}
                </p>
                <p className="text-sm text-muted-foreground">
                  Aniversário:{" "}
                  {new Date(employee.dataNascimento).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(employee)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(employee.id)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum funcionário encontrado</p>
        </Card>
      )}
    </div>
  );
}
