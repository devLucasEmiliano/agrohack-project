"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  type Employee,
  getEmployees,
  deleteEmployee as deleteEmployeeLocal,
  saveEmployees,
} from "@/lib/employees-data";
import {
  fetchEmployees,
  deleteEmployee as deleteEmployeeAPI,
  type EmployeeFromAPI,
} from "@/lib/api-service";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface EmployeesListProps {
  onEdit?: (employee: Employee) => void; // Opcional - função de editar oculta temporariamente
  onAdd: () => void;
  refreshTrigger?: number;
}

export default function EmployeesList({
  onEdit, // Função de editar oculta temporariamente
  onAdd,
  refreshTrigger,
}: EmployeesListProps) {
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
  const loadEmployees = useCallback(async () => {
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
  }, []);

  // Carrega funcionários ao montar o componente
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Recarrega quando refreshTrigger mudar
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadEmployees();
    }
  }, [refreshTrigger, loadEmployees]);

  const handleDelete = async (employee: Employee) => {
    if (!confirm(`Deseja realmente excluir ${employee.name}?`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Transforma data de YYYY-MM-DD para DD/MM/YYYY
      const [year, month, day] = employee.dataNascimento.split("-");
      const dataNascimento = `${day}/${month}/${year}`;

      // Envia para API
      await deleteEmployeeAPI({
        nomeCompleto: employee.name,
        matricula: employee.matricula,
        data_nascimento: dataNascimento,
      });

      // Remove do localStorage
      deleteEmployeeLocal(employee.id);

      // Recarrega a lista
      await loadEmployees();

      console.log(`Funcionário ${employee.name} excluído com sucesso`);
    } catch (err) {
      console.error("Erro ao excluir funcionário:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao excluir funcionário"
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.matricula.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Mensagem de Erro */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-1">
                Erro ao carregar funcionários
              </h3>
              <p className="text-sm text-destructive/90">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {employees.length > 0
                  ? "Exibindo dados do cache local."
                  : "Verifique sua conexão e tente novamente."}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Barra de Busca e Ações */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Buscar por nome ou matrícula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
          disabled={loading}
        />
        <Button
          onClick={loadEmployees}
          variant="outline"
          size="sm"
          disabled={loading}
          className="gap-2"
          title="Atualizar lista"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Atualizar</span>
        </Button>
        <Button
          onClick={onAdd}
          className="gap-2 bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo</span>
        </Button>
      </div>

      {/* Loading State */}
      {loading && employees.length === 0 && (
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando funcionários...</p>
        </Card>
      )}

      {/* Lista de Funcionários */}
      {!loading || employees.length > 0 ? (
        <div className="grid gap-3">
          {filtered.map((employee) => (
            <Card
              key={employee.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-lg">
                    {employee.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Matrícula:</span>{" "}
                      {employee.matricula}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Nascimento:</span>{" "}
                      {new Date(employee.dataNascimento).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  {employee.createdAt && (
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Cadastrado em:{" "}
                      {new Date(employee.createdAt).toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {/* Botão de editar oculto temporariamente */}
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(employee)}
                      className="gap-2"
                      title="Editar funcionário"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(employee)}
                    className="gap-2"
                    title="Excluir funcionário"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {search
              ? "Nenhum funcionário encontrado com esse critério"
              : "Nenhum funcionário cadastrado"}
          </p>
          {!search && (
            <Button
              onClick={onAdd}
              className="mt-4 gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Cadastrar primeiro funcionário
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
