"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, FileText, BarChart3, Users } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo, {user?.name}</h1>
        <p className="text-muted-foreground">Gerencie seus registros de horas trabalhadas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Quick Actions */}
        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Registrar Horas</CardTitle>
                <CardDescription>Adicione um novo registro</CardDescription>
              </div>
              <Clock className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/register">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Iniciar Registro
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Consultar Registros</CardTitle>
                <CardDescription>Veja seu histórico</CardDescription>
              </div>
              <FileText className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/history">
              <Button variant="outline" className="w-full bg-transparent">
                Ver Histórico
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Relatórios</CardTitle>
                <CardDescription>Análise de horas</CardDescription>
              </div>
              <BarChart3 className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* Employees Management */}
        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Funcionários</CardTitle>
                <CardDescription>Gerenciar funcionários</CardDescription>
              </div>
              <Users className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/employees">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Gerenciar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Seus últimos registros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum registro ainda</p>
            <p className="text-sm">Comece clicando em &quot;Registrar Horas&quot;</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
