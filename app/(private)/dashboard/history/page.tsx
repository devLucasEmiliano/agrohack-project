"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Eye, Download } from "lucide-react";
import type { FormData } from "@/components/chat-bot";

interface WorkRecord extends FormData {
  id: string;
  createdAt: string;
}

export default function HistoryPage() {
  // Access user if needed later (kept to avoid future unused removal decisions)
  useAuth();
  const [records, setRecords] = useState<WorkRecord[]>(() => {
    try {
      const stored = localStorage.getItem("workRecords");
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<WorkRecord | null>(null);
  // Loading considered true until first render completes (records already loaded lazily)
  const loading = false;

  const filteredRecords = useMemo(() => {
    let filtered = records;
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.operador?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.matricula?.includes(searchTerm) ||
          r.localServico?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterDate) {
      filtered = filtered.filter((r) => r.data === filterDate);
    }
    return filtered;
  }, [records, searchTerm, filterDate]);

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este registro?")) {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      localStorage.setItem("workRecords", JSON.stringify(updated));
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
      "Máquina",
      "Horimetro Inicial",
      "Horimetro Final",
      "Total Serviço",
      "Unidade",
      "Abastecimento",
      "Data de Criação",
    ];

    const rows = filteredRecords.map((r) => [
      r.data,
      r.operador,
      r.matricula,
      r.localServico,
      r.raSignla,
      r.maquina,
      r.horimetroInicial,
      r.horimetroFinal,
      r.totalServico,
      r.unidadeServico,
      r.abastecimento,
      new Date(r.createdAt).toLocaleDateString("pt-BR"),
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
                      {record.operador}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Matrícula
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {record.matricula}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Local
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {record.localServico}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Data
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(record.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 py-4 border-y border-border">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Máquina
                    </p>
                    <p className="text-sm text-foreground">
                      {record.maquina || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Horimetro
                    </p>
                    <p className="text-sm text-foreground">
                      {record.horimetroInicial} → {record.horimetroFinal}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Total
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {record.totalServico} {record.unidadeServico}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Abastecimento
                    </p>
                    <p className="text-sm text-foreground">
                      {record.abastecimento || "-"} L
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
                  <Button
                    onClick={() => handleDelete(record.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                    {selectedRecord.operador}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Matrícula
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.matricula}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Local do Serviço
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.localServico}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    RA
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.raSignla}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Data
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(selectedRecord.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Horário
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.horaInicio} - {selectedRecord.horaFim}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Máquina
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedRecord.maquina}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Implementos
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedRecord.implementos}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Horimetro Inicial
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedRecord.horimetroInicial}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Horimetro Final
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedRecord.horimetroFinal}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Total do Serviço
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedRecord.totalServico}{" "}
                    {selectedRecord.unidadeServico}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Abastecimento
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedRecord.abastecimento || "-"} L
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium">
                  Observações
                </p>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {selectedRecord.observacoes || "-"}
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Criado em:{" "}
                  {new Date(selectedRecord.createdAt).toLocaleString("pt-BR")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
