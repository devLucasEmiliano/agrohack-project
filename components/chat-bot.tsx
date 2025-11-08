"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ChevronRight, MessageCircle, Clock, MapPin, Loader2 } from "lucide-react"
import { OPERATORS_DATABASE, SERVICOS, RA_DATABASE } from "@/lib/operators-data"

export type FormData = {
  operador: string
  matricula: string
  localServico: string
  raSignla: string
  comunidade: string
  processo: string
  data: string
  horaInicio: string
  horaFim: string
  maquina: string
  prefixoMaquina: string
  implementos: string
  prefixoImplementos: string
  horimetroInicial: string
  horimetroFinal: string
  totalServico: string
  unidadeServico: string
  abastecimento: string
  servicos: Record<string, { selected: boolean; unidade: string }>
  observacoes: string
}

const STEPS = [
  { title: "Informações Pessoais", fields: ["operador", "matricula", "localServico", "raSignla", "comunidade"] },
  { title: "Detalhes do Serviço", fields: ["processo", "data", "horaInicio", "horaFim"] },
  { title: "Máquinas e Implementos", fields: ["maquina", "prefixoMaquina", "implementos", "prefixoImplementos"] },
  {
    title: "Horimetros e Serviços",
    fields: ["horimetroInicial", "horimetroFinal", "totalServico", "unidadeServico", "abastecimento", "servicos"],
  },
  { title: "Conclusão", fields: ["observacoes"] },
]

function ChatBot({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loadingGPS, setLoadingGPS] = useState(false)
  const [formData, setFormData] = useState<Partial<FormData>>({
    servicos: {},
    data: new Date().toISOString().split("T")[0],
    horaInicio: new Date().toTimeString().slice(0, 5),
  })

  const filteredOperators = useMemo(() => {
    if (!formData.operador) return []
    const query = (formData.operador as string).toLowerCase()
    return OPERATORS_DATABASE.filter((op) => op.nome.toLowerCase().includes(query) || op.matricula.includes(query))
  }, [formData.operador])

  const filteredRA = useMemo(() => {
    if (!formData.raSignla) return []
    const query = (formData.raSignla as string).toLowerCase()
    return RA_DATABASE.filter((ra) => ra.numero.toLowerCase().includes(query) || ra.nome.toLowerCase().includes(query))
  }, [formData.raSignla])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSelectOperator = (operator: (typeof OPERATORS_DATABASE)[0]) => {
    setFormData((prev) => ({
      ...prev,
      operador: operator.nome,
      matricula: operator.matricula,
      localServico: operator.local,
      raSignla: operator.ra,
    }))
  }

  const handleSelectRA = (ra: (typeof RA_DATABASE)[0]) => {
    setFormData((prev) => ({
      ...prev,
      raSignla: ra.numero,
      comunidade: ra.nome,
    }))
  }

  const handleGetGPSLocation = useCallback(() => {
    setLoadingGPS(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          handleInputChange("localServico", `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          setLoadingGPS(false)
        },
        () => {
          alert("Erro ao obter localização. Verifique as permissões.")
          setLoadingGPS(false)
        },
      )
    }
  }, [])

  const handleServiceToggle = (serviceId: string, unidade: string) => {
    setFormData((prev) => ({
      ...prev,
      servicos: {
        ...(prev.servicos || {}),
        [serviceId]: {
          selected: !(prev.servicos?.[serviceId]?.selected || false),
          unidade,
        },
      },
    }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onSubmit(formData as FormData)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <div className="bg-primary p-4 sm:p-6 text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold">Registro de Horas</h1>
          </div>
          <div className="text-xs sm:text-sm text-primary-foreground/70 mb-3 sm:mb-4">
            Passo {currentStep + 1} de {STEPS.length}
          </div>
          <div className="w-full bg-primary/20 rounded-full h-2">
            <div className="bg-accent h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 bg-background">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">{step.title}</h2>

          {currentStep === 0 && (
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Nome do Operador</label>
                <Input
                  value={formData.operador || ""}
                  onChange={(e) => handleInputChange("operador", e.target.value)}
                  placeholder="Digite o nome ou matrícula"
                  className="w-full text-sm"
                />
                {filteredOperators.length > 0 && (
                  <div className="mt-2 border border-border rounded-lg bg-card max-h-40 overflow-y-auto">
                    {filteredOperators.map((op) => (
                      <button
                        key={op.id}
                        onClick={() => handleSelectOperator(op)}
                        className="w-full px-3 py-2 text-left hover:bg-secondary border-b border-border last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-sm text-card-foreground">{op.nome}</div>
                        <div className="text-xs text-muted-foreground">
                          Mat: {op.matricula} • {op.local}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                label="Matrícula"
                value={formData.matricula || ""}
                onChange={(e) => handleInputChange("matricula", e.target.value)}
                placeholder="Editar matrícula"
              />

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Local do Serviço</label>
                <div className="flex gap-2">
                  <Input
                    value={formData.localServico || ""}
                    onChange={(e) => handleInputChange("localServico", e.target.value)}
                    placeholder="Digite local ou use GPS"
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleGetGPSLocation}
                    disabled={loadingGPS}
                    size="sm"
                    variant="outline"
                    className="px-3 bg-transparent"
                  >
                    {loadingGPS ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Sigla RA</label>
                  <Input
                    value={formData.raSignla || ""}
                    onChange={(e) => handleInputChange("raSignla", e.target.value)}
                    placeholder="I, II, III..."
                    className="w-full text-sm"
                  />
                  {filteredRA.length > 0 && (
                    <div className="mt-2 border border-border rounded-lg bg-card max-h-40 overflow-y-auto">
                      {filteredRA.map((ra) => (
                        <button
                          key={ra.numero}
                          onClick={() => handleSelectRA(ra)}
                          className="w-full px-3 py-2 text-left hover:bg-secondary border-b border-border last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-sm text-card-foreground">{ra.numero}</div>
                          <div className="text-xs text-muted-foreground">{ra.nome}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <FormField
                  label="Comunidade/Região"
                  value={formData.comunidade || ""}
                  onChange={(e) => handleInputChange("comunidade", e.target.value)}
                  placeholder="Nome da região"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-3 sm:space-y-4">
              <FormField
                label="Processo SEI"
                value={formData.processo || ""}
                onChange={(e) => handleInputChange("processo", e.target.value)}
                placeholder="Número do processo"
              />
              <FormField
                label="Data"
                type="date"
                value={formData.data || ""}
                onChange={(e) => handleInputChange("data", e.target.value)}
              />
              <div className="border-l-4 border-accent bg-accent/10 p-4 rounded">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-accent-foreground flex-shrink-0" />
                  <label className="font-semibold text-accent-foreground text-sm sm:text-base">
                    Horário de Trabalho
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <FormField
                    label="Início"
                    type="time"
                    value={formData.horaInicio || ""}
                    onChange={(e) => handleInputChange("horaInicio", e.target.value)}
                  />
                  <FormField
                    label="Fim"
                    type="time"
                    value={formData.horaFim || ""}
                    onChange={(e) => handleInputChange("horaFim", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <FormField
                  label="Máquina"
                  value={formData.maquina || ""}
                  onChange={(e) => handleInputChange("maquina", e.target.value)}
                  placeholder="ID da máquina"
                />
                <FormField
                  label="Prefixo Máquina"
                  value={formData.prefixoMaquina || ""}
                  onChange={(e) => handleInputChange("prefixoMaquina", e.target.value)}
                  placeholder="Prefixo"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <FormField
                  label="Implementos"
                  value={formData.implementos || ""}
                  onChange={(e) => handleInputChange("implementos", e.target.value)}
                  placeholder="ID implementos"
                />
                <FormField
                  label="Prefixo Implementos"
                  value={formData.prefixoImplementos || ""}
                  onChange={(e) => handleInputChange("prefixoImplementos", e.target.value)}
                  placeholder="Prefixo"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <FormField
                  label="Horimetro Inicial"
                  value={formData.horimetroInicial || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4)
                    handleInputChange("horimetroInicial", val)
                  }}
                  placeholder="0934"
                  maxLength={4}
                />
                <FormField
                  label="Horimetro Final"
                  value={formData.horimetroFinal || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4)
                    handleInputChange("horimetroFinal", val)
                  }}
                  placeholder="0940"
                  maxLength={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="col-span-2">
                  <FormField
                    label="Total do Serviço"
                    value={formData.totalServico || ""}
                    onChange={(e) => handleInputChange("totalServico", e.target.value)}
                    placeholder="Valor"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Unidade</label>
                  <select
                    value={formData.unidadeServico || ""}
                    onChange={(e) => handleInputChange("unidadeServico", e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Tipo</option>
                    <option value="m">m</option>
                    <option value="m²">m²</option>
                    <option value="m³">m³</option>
                    <option value="km">km</option>
                    <option value="ha">ha</option>
                    <option value="UD">UD</option>
                    <option value="HM">HM</option>
                  </select>
                </div>
              </div>

              <FormField
                label="Abastecimento (litros)"
                value={formData.abastecimento || ""}
                onChange={(e) => handleInputChange("abastecimento", e.target.value)}
                placeholder="Quantidade em litros"
                type="number"
              />

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Serviços Realizados</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICOS.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceToggle(service.id, service.unidade)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left text-sm ${
                        formData.servicos?.[service.id]?.selected
                          ? "border-accent bg-accent/20 shadow-md"
                          : "border-border bg-card hover:border-accent hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                            formData.servicos?.[service.id]?.selected
                              ? "border-accent bg-accent"
                              : "border-input bg-background"
                          }`}
                        >
                          {formData.servicos?.[service.id]?.selected && (
                            <svg
                              className="w-3 h-3 text-accent-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{service.label}</p>
                          <p className="text-xs text-muted-foreground">{service.unidade}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Observações/Outros Serviços</label>
                <textarea
                  value={formData.observacoes || ""}
                  onChange={(e) => handleInputChange("observacoes", e.target.value)}
                  placeholder="Digite aqui observações adicionais"
                  className="w-full p-3 text-sm border border-border rounded-lg bg-card text-card-foreground focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-secondary px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 justify-between rounded-b-lg border-t border-border">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 sm:flex-none text-sm bg-transparent"
          >
            Anterior
          </Button>

          <Button
            onClick={handleNext}
            className="flex-1 sm:flex-none bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2 text-sm"
          >
            {currentStep === STEPS.length - 1 ? "Confirmar" : "Próximo"}
            {currentStep < STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </Card>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  maxLength?: number
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground block mb-2">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full text-sm"
      />
    </div>
  )
}

export { ChatBot }
export default ChatBot
