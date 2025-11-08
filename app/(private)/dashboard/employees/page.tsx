"use client";

import { useState } from "react";
import type { Employee } from "@/lib/employees-data";
import EmployeesList from "@/components/employees-list";
import EmployeeForm from "@/components/employee-form";

export default function EmployeesPage() {
  const [editingEmployee, setEditingEmployee] = useState<
    Employee | undefined
  >();
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSave = () => {
    setEditingEmployee(undefined);
    setShowForm(false);
    // Trigger refresh da lista
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAdd = () => {
    setEditingEmployee(undefined);
    setShowForm(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingEmployee(undefined);
    setShowForm(false);
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
        {showForm && (
          <div className="lg:col-span-1">
            <EmployeeForm
              key={editingEmployee?.id || "new"}
              employee={editingEmployee}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
          <EmployeesList
            onEdit={handleEdit}
            onAdd={handleAdd}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}
