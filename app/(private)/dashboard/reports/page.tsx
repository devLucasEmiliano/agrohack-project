"use client";

import { useEffect, useState } from "react";
import { getEmployees, type Employee } from "@/lib/employees-data";
import {
  getTimesheetByDateRange,
  type TimesheetEntry,
} from "@/lib/timesheet-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [weeklyData, setWeeklyData] = useState<TimesheetEntry[]>([]);

  useEffect(() => {
    const loadEmployees = () => {
      setEmployees(getEmployees());
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    if (!selectedEmployee) return;

    const loadWeeklyData = () => {
      const today = new Date();
      const currentDay = today.getDay();
      const diff = currentDay === 0 ? 6 : currentDay - 1;

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - diff + weekOffset * 7);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const entries = getTimesheetByDateRange(
        startOfWeek.toISOString(),
        endOfWeek.toISOString()
      ).filter((entry) => entry.employeeId === selectedEmployee);

      setWeeklyData(entries);
    };
    loadWeeklyData();
  }, [selectedEmployee, weekOffset]);

  const getWeekRange = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - diff + weekOffset * 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      start: startOfWeek.toLocaleDateString("pt-BR"),
      end: endOfWeek.toLocaleDateString("pt-BR"),
    };
  };

  const calculateTotal = () => {
    return weeklyData.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  };

  const exportToCSV = () => {
    if (weeklyData.length === 0) return;

    const employee = employees.find((e) => e.id === selectedEmployee);
    const weekRange = getWeekRange();

    const headers = [
      "Data",
      "Horário Início",
      "Horário Fim",
      "Horas Trabalhadas",
      "Atividade",
      "Local",
      "Observações",
    ];
    const rows = weeklyData.map((entry) => [
      new Date(entry.date).toLocaleDateString("pt-BR"),
      entry.startTime,
      entry.endTime,
      entry.hoursWorked.toFixed(1),
      entry.activity,
      entry.location,
      entry.notes || "",
    ]);

    const csvContent = [
      [`Relatório Semanal - ${employee?.name}`],
      [`Período: ${weekRange.start} a ${weekRange.end}`],
      [`Total de Horas: ${calculateTotal().toFixed(1)}h`],
      [],
      headers,
      ...rows,
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_${employee?.name.replace(
      /\s+/g,
      "_"
    )}_${weekRange.start.replace(/\//g, "-")}.csv`;
    link.click();
  };

  const weekRange = getWeekRange();
  const totalHours = calculateTotal();

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Relatórios Semanais
        </h1>
        <p className="text-muted-foreground">
          Extraia folhas de horas semanais por funcionário
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Gerar Relatório</CardTitle>
          <CardDescription>
            Selecione um funcionário e a semana para gerar o relatório
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Funcionário
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione um funcionário</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} - {emp.matricula}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Semana
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWeekOffset(weekOffset - 1)}
                >
                  ← Anterior
                </Button>
                <div className="flex-1 text-center px-4 py-2 border border-border rounded-md bg-background">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {weekRange.start} - {weekRange.end}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWeekOffset(weekOffset + 1)}
                  disabled={weekOffset >= 0}
                >
                  Próxima →
                </Button>
              </div>
            </div>
          </div>

          {selectedEmployee && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total de Horas
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {totalHours.toFixed(1)}h
                  </div>
                </div>
                <Button
                  onClick={exportToCSV}
                  disabled={weeklyData.length === 0}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>

              {weeklyData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum registro encontrado para esta semana
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">
                          Data
                        </th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">
                          Horário
                        </th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">
                          Atividade
                        </th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">
                          Local
                        </th>
                        <th className="text-right py-2 px-4 text-sm font-medium text-muted-foreground">
                          Horas
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyData.map((entry) => (
                        <tr
                          key={entry.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-3 px-4 text-sm">
                            {new Date(entry.date).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {entry.startTime} - {entry.endTime}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {entry.activity}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {entry.location}
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium">
                            {entry.hoursWorked.toFixed(1)}h
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
