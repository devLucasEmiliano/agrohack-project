"use client";

import { useState } from "react";
import type { Employee } from "@/lib/employees-data";
import EmployeesList from "@/components/employees-list";
import EmployeeForm from "@/components/employee-form";

export default function EmployeesPage() {
  const [editingEmployee, setEditingEmployee] = useState<
    Employee | undefined
  >();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSave = () => {
    setEditingEmployee(undefined);
    setRefreshKey((prev) => prev + 1);
  };

  const handleAdd = () => {
    setEditingEmployee(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Gerenciamento de Funcionários
        </h1>
        <p className="text-muted-foreground mt-2">
          Cadastre e gerencie os funcionários da empresa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {editingEmployee || (refreshKey === 0 && !editingEmployee) ? (
          <div className="lg:col-span-1">
            {!editingEmployee ? (
              <EmployeeForm
                onSave={handleSave}
                onCancel={() => setEditingEmployee(undefined)}
              />
            ) : (
              <EmployeeForm
                key={editingEmployee.id}
                employee={editingEmployee}
                onSave={handleSave}
                onCancel={() => setEditingEmployee(undefined)}
              />
            )}
          </div>
        ) : null}

        <div className={editingEmployee ? "lg:col-span-2" : "lg:col-span-3"}>
          <EmployeesList
            key={refreshKey}
            onEdit={setEditingEmployee}
            onAdd={handleAdd}
          />
        </div>
      </div>
    </div>
  );
}
