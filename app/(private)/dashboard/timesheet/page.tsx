"use client";

import { useEffect, useState } from "react";
import { getEmployees, type Employee } from "@/lib/employees-data";
import {
  getTimesheetByEmployee,
  type TimesheetEntry,
} from "@/lib/timesheet-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimesheetModule } from "@/components/timesheet-module";

export default function TimesheetPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timesheetData, setTimesheetData] = useState<
    Record<string, TimesheetEntry[]>
  >({});

  useEffect(() => {
    const loadData = () => {
      const employeesList = getEmployees();
      setEmployees(employeesList);

      const mapped: Record<string, TimesheetEntry[]> = {};
      employeesList.forEach((emp) => {
        mapped[emp.id] = getTimesheetByEmployee(emp.id);
      });
      setTimesheetData(mapped);
    };

    loadData();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Folha de Horas Completa
        </h1>
        <p className="text-muted-foreground">
          Visualize as horas trabalhadas por funcionário
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Cada registro replica o modelo oficial do governo para facilitar
          impressões e assinaturas.
        </p>
      </div>

      {employees.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum funcionário cadastrado ainda
            </p>
            <Button className="mt-4" asChild>
              <a href="/dashboard/employees">Cadastrar Funcionário</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {employees.map((employee) => (
            <TimesheetModule
              key={employee.id}
              employee={employee}
              entries={timesheetData[employee.id] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
