"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Eye, Download, AlertCircle } from "lucide-react";
import {
  fetchGlobalHistory,
  type EmployeeHoursRecord,
} from "@/lib/api-service";

export default function HistoryPage() {
  useAuth();
  const [records, setRecords] = useState<EmployeeHoursRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedRecord, setSelectedRecord] =
    useState<EmployeeHoursRecord | null>(null);

  // Carrega registros da API ao montar
  useEffect(() => {
    let ignore = false;

    const loadRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGlobalHistory();
        if (ignore) return;
        setRecords(data);
      } catch (err) {
        if (ignore) return;
        console.error("Erro ao carregar histórico:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o histórico."
        );
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadRecords();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredRecords = useMemo(() => {
    let filtered = records;
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.OPERADOR_NOME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.OPERADOR_MATRICULA?.includes(searchTerm) ||
          r.LOCAL_SERVICO?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterDate) {
      filtered = filtered.filter((r) => r.DATA === filterDate);
    }
    return filtered;
  }, [records, searchTerm, filterDate]);

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este registro?")) {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      // TODO: Implementar exclusão via API quando disponível
    }
  };

  const handleDownloadCSV = () => {
    if (filteredRecords.length === 0) {
      alert("Nenhum registro para exportar");
      return;
    }

    const headers = [
      "Data",
      "Operador",
      "Matrícula",
      "Local",
      "RA",
      "Comunidade",
      "Máquina",
      "Horimetro Inicial",
      "Horimetro Final",
      "Total Serviço",
      "Abastecimento",
      "Data de Criação",
    ];

    const rows = filteredRecords.map((r) => [
      r.DATA,
      r.OPERADOR_NOME,
      r.OPERADOR_MATRICULA,
      r.LOCAL_SERVICO,
      r.RA,
      r.COMUNIDADE,
      r.MAQUINA_PREFIXO,
      r.HORIMETRO_INICIAL,
      r.HORIMETRO_FINAL,
      r.TOTAL_SERVICO,
      r.ABASTECIMENTO,
      r.createdAt ? new Date(r.createdAt).toLocaleDateString("pt-BR") : "-",
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell || ""}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registros_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Carregando registros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-destructive/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 text-destructive">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Erro ao carregar histórico</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Histórico de Registros
        </h1>
        <p className="text-muted-foreground">
          Total: <span className="font-semibold">{filteredRecords.length}</span>{" "}
          registros
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Buscar por operador, matrícula ou local
              </label>
              <Input
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Filtrar por data
              </label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full text-sm"
              />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDate("");
                }}
                variant="outline"
                className="text-sm"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleDownloadCSV}
          disabled={filteredRecords.length === 0}
          className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhum registro encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card
              key={record.id}
              className="border-border hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Operador
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {record.OPERADOR_NOME}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Matrícula
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {record.OPERADOR_MATRICULA}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Local
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {record.LOCAL_SERVICO}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Data
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(record.DATA).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-border">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Máquina
                    </p>
                    <p className="text-sm text-foreground">
                      {record.MAQUINA_PREFIXO || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Horimetro
                    </p>
                    <p className="text-sm text-foreground">
                      {record.HORIMETRO_INICIAL} → {record.HORIMETRO_FINAL}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Total
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {record.TOTAL_SERVICO}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Abastecimento
                    </p>
                    <p className="text-sm text-foreground">
                      {record.ABASTECIMENTO || "-"} L
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => setSelectedRecord(record)}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  {record.id && (
                    <Button
                      onClick={() => handleDelete(record.id!)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalhes do Registro</CardTitle>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Operador
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.OPERADOR_NOME}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Matrícula
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.OPERADOR_MATRICULA}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Local do Serviço
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.LOCAL_SERVICO}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    RA
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.RA}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Data
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(selectedRecord.DATA).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Horário
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.HORA_INICIAL || "-"} -{" "}
                    {selectedRecord.HORA_FINAL}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Máquina
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedRecord.MAQUINA_PREFIXO}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Implementos
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedRecord.IMPLEMENTO_PREFIXO}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Horimetro Inicial
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedRecord.HORIMETRO_INICIAL}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Horimetro Final
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedRecord.HORIMETRO_FINAL}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Total do Serviço
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.TOTAL_SERVICO}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Abastecimento
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedRecord.ABASTECIMENTO || "-"} L
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium">
                  Observações
                </p>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {selectedRecord.OBSERVACAO || "-"}
                </p>
              </div>

              {selectedRecord.createdAt && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Criado em:{" "}
                    {new Date(selectedRecord.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
