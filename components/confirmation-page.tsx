"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check, Edit2, Loader2 } from "lucide-react"
import { SERVICOS, RA_DATABASE } from "@/lib/operators-data"
import type { FormData } from "./chat-bot"

export function ConfirmationPage({
  data,
  onSubmit,
  onEdit,
}: {
  data: FormData
  onSubmit: () => void
  onEdit: () => void
}) {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [localData, setLocalData] = useState(data)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEdit = (field: string) => {
    setEditingField(field)
  }

  const handleUpdate = (field: string, value: string) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setEditingField(null)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const records = JSON.parse(localStorage.getItem("workRecords") || "[]")
      records.push({
        id: Date.now().toString(),
        ...localData,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem("workRecords", JSON.stringify(records))
      setSubmitted(true)
      onSubmit()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRaFullName = () => {
    const ra = RA_DATABASE.find((r) => r.numero === localData.raSignla)
    return ra ? `${ra.numero} - ${ra.nome}` : localData.raSignla
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background p-3 sm:p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg text-center p-6 sm:p-8">
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="bg-accent/20 p-3 sm:p-4 rounded-full">
              <Check className="w-8 h-8 sm:w-12 sm:h-12 text-accent-foreground" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Enviado com Sucesso!</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">Seus dados foram registrados com sucesso.</p>
          <Button
            onClick={() => {
              setSubmitted(false)
              onEdit()
            }}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm"
          >
            Novo Registro
          </Button>
        </Card>
      </div>
    )
  }

  const selectedServices = Object.entries(localData.servicos || {})
    .filter(([, data]) => data.selected)
    .map(([id]) => {
      const service = SERVICOS.find((s) => s.id === id)
      return { label: service?.label, unidade: service?.unidade }
    })

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={onEdit}
            className="mb-3 sm:mb-4 flex items-center gap-2 text-accent hover:text-accent-foreground hover:bg-accent/10 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Edição
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Confirmação de Dados</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Revise e confirme suas informações</p>
        </div>

        {/* Confirmation Form - Mobile First */}
        <div className="space-y-3 sm:space-y-4">
          <SectionCard title="Informações Pessoais">
            <ConfirmationField
              label="Operador"
              value={localData.operador}
              field="operador"
              editingField={editingField}
              onEdit={handleEdit}
              onUpdate={handleUpdate}
            />
            <ConfirmationField
              label="Matrícula"
              value={localData.matricula}
              field="matricula"
              editingField={editingField}
              onEdit={handleEdit}
              onUpdate={handleUpdate}
            />
            <ConfirmationField
              label="Local do Serviço"
              value={localData.localServico}
              field="localServico"
              editingField={editingField}
              onEdit={handleEdit}
              onUpdate={handleUpdate}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
                  Região Administrativa
                </label>
                <div className="bg-secondary border border-border rounded-md px-2 sm:px-3 py-2 text-card-foreground font-medium text-sm">
                  {getRaFullName() || "(vazio)"}
                </div>
              </div>
              <ConfirmationField
                label="Comunidade"
                value={localData.comunidade}
                field="comunidade"
                editingField={editingField}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
              />
            </div>
          </SectionCard>

          <SectionCard title="Detalhes do Serviço">
            <ConfirmationField
              label="Processo SEI"
              value={localData.processo}
              field="processo"
              editingField={editingField}
              onEdit={handleEdit}
              onUpdate={handleUpdate}
            />
            <ConfirmationField
              label="Data"
              value={localData.data}
              field="data"
              editingField={editingField}
              onEdit={handleEdit}
              onUpdate={handleUpdate}
              type="date"
            />
            <div className="border-l-4 border-accent bg-accent/10 p-4 rounded">
              <label className="block text-xs sm:text-sm font-semibold text-accent-foreground mb-3">
                Horário de Trabalho
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <p className="text-xs text-accent-foreground font-medium">Início</p>
                  <p className="text-base sm:text-lg font-bold text-accent-foreground">
                    {localData.horaInicio || "--:--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-accent-foreground font-medium">Fim</p>
                  <p className="text-base sm:text-lg font-bold text-accent-foreground">
                    {localData.horaFim || "--:--"}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Máquinas e Implementos">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <ConfirmationField
                label="Máquina"
                value={localData.maquina}
                field="maquina"
                editingField={editingField}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
              />
              <ConfirmationField
                label="Prefixo Máquina"
                value={localData.prefixoMaquina}
                field="prefixoMaquina"
                editingField={editingField}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <ConfirmationField
                label="Implementos"
                value={localData.implementos}
                field="implementos"
                editingField={editingField}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
              />
              <ConfirmationField
                label="Prefixo Implementos"
                value={localData.prefixoImplementos}
                field="prefixoImplementos"
                editingField={editingField}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
              />
            </div>
          </SectionCard>

          <SectionCard title="Horimetros e Serviços">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <ConfirmationField
                label="Horimetro Inicial"
                value={localData.horimetroInicial}
                field="horimetroInicial"
                editingField={editingField}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
              />
              <ConfirmationField
                label="Horimetro Final"
                value={localData.horimetroFinal}
                field="horimetroFinal"
                editingField={editingField}
                onEdit={handleEdit}
                onUpdate={handleUpdate}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <ConfirmationField
                  label="Total do Serviço"
                  value={localData.totalServico}
                  field="totalServico"
                  editingField={editingField}
                  onEdit={handleEdit}
                  onUpdate={handleUpdate}
                />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-foreground mb-1">Unidade</p>
                <div className="bg-secondary border border-border rounded-md px-2 sm:px-3 py-2 text-card-foreground font-semibold text-sm">
                  {localData.unidadeServico || "N/A"}
                </div>
              </div>
            </div>
            <ConfirmationField
              label="Abastecimento (litros)"
              value={localData.abastecimento}
              field="abastecimento"
              editingField={editingField}
              onEdit={handleEdit}
              onUpdate={handleUpdate}
            />
            {selectedServices.length > 0 && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                  Serviços Selecionados
                </label>
                <div className="bg-accent/20 border border-accent rounded-lg p-2 sm:p-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedServices.map((service, idx) => (
                      <span
                        key={idx}
                        className="bg-accent text-accent-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {service.label} ({service.unidade})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Observações">
            <div className="bg-secondary border border-border rounded-lg p-3 text-sm text-card-foreground whitespace-pre-wrap">
              {localData.observacoes || "(Nenhuma observação)"}
            </div>
          </SectionCard>
        </div>

        {/* Action Buttons - Mobile First */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <Button variant="outline" onClick={onEdit} className="order-2 sm:order-1 text-sm bg-transparent">
            Editar Novamente
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="order-1 sm:order-2 bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirmar e Enviar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="p-3 sm:p-4 shadow-md bg-card border-border">
      <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 pb-2 border-b-2 border-accent/30">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </Card>
  )
}

function ConfirmationField({
  label,
  value,
  field,
  editingField,
  onEdit,
  onUpdate,
  type = "text",
}: {
  label: string
  value: string
  field: string
  editingField: string | null
  onEdit: (field: string) => void
  onUpdate: (field: string, value: string) => void
  type?: string
}) {
  const isEditing = editingField === field

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">{label}</label>
        {isEditing ? (
          <Input
            type={type}
            autoFocus
            defaultValue={value}
            onBlur={(e) => onUpdate(field, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onUpdate(field, e.currentTarget.value)
              }
            }}
            className="w-full text-sm border-border"
          />
        ) : (
          <div className="bg-secondary border border-border rounded-md px-2 sm:px-3 py-2 text-card-foreground font-medium text-sm">
            {value || "(vazio)"}
          </div>
        )}
      </div>
      {!isEditing && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(field)}
          className="text-accent hover:text-accent-foreground hover:bg-accent/10 flex-shrink-0"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}

export default ConfirmationPage
