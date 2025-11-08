"use client";

import { useEffect, useState } from "react";
import { calculateStatistics } from "@/lib/timesheet-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Clock,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalHours: 0,
    totalEntries: 0,
    avgHoursPerDay: 0,
    currentWeekHours: 0,
    currentMonthHours: 0,
    activeEmployees: 0,
  });

  useEffect(() => {
    const loadStats = () => {
      setStats(calculateStatistics());
    };
    loadStats();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo!</h1>
        <p className="text-muted-foreground">
          Visão geral e estatísticas dos registros de horas
        </p>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Horas Trabalhadas (Semana)
            </CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.currentWeekHours}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total da semana atual
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Horas Trabalhadas (Mês)
            </CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.currentMonthHours}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total do mês atual
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Funcionários Ativos
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.activeEmployees}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Últimos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Horas
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalHours}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Acumulado geral
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Registros Totais
            </CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalEntries}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Todos os registros
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Média Diária
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.avgHoursPerDay}h
            </div>
            <p className="text-xs text-muted-foreground mt-1">Horas por dia</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Registrar Horas</CardTitle>
                  <CardDescription>Adicionar novo registro</CardDescription>
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
                  <CardTitle className="text-lg">Histórico</CardTitle>
                  <CardDescription>Todos os registros</CardDescription>
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
                  <CardTitle className="text-lg">Funcionários</CardTitle>
                  <CardDescription>Gerenciar equipe</CardDescription>
                </div>
                <Users className="w-8 h-8 text-primary opacity-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/employees">
                <Button variant="outline" className="w-full bg-transparent">
                  Gerenciar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Relatórios</CardTitle>
                  <CardDescription>Extrair folhas semanais</CardDescription>
                </div>
                <Download className="w-8 h-8 text-primary opacity-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/reports">
                <Button variant="outline" className="w-full bg-transparent">
                  Gerar Relatórios
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
