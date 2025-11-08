"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { type Employee, addEmployee, updateEmployee } from "@/lib/employees-data"
import { X } from "lucide-react"

interface EmployeeFormProps {
  employee?: Employee
  onSave: (employee: Employee) => void
  onCancel: () => void
}

export default function EmployeeForm({ employee, onSave, onCancel }: EmployeeFormProps) {
  const [form, setForm] = useState({
    name: employee?.name || "",
    matricula: employee?.matricula || "",
    dataNascimento: employee?.dataNascimento || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.matricula || !form.dataNascimento) {
      alert("Preencha todos os campos")
      return
    }

    if (employee) {
      updateEmployee(employee.id, form)
      onSave({ ...employee, ...form })
    } else {
      const newEmployee = addEmployee(form)
      onSave(newEmployee)
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">
          {employee ? "Editar Funcionário" : "Novo Funcionário"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel} className="hover:bg-muted">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
          <Input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome do funcionário"
            className="bg-background border-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Matrícula</label>
          <Input
            type="text"
            value={form.matricula}
            onChange={(e) => setForm({ ...form, matricula: e.target.value })}
            placeholder="Número da matrícula"
            className="bg-background border-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Data de Aniversário</label>
          <Input
            type="date"
            value={form.dataNascimento}
            onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
            className="bg-background border-input"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
            Salvar
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
