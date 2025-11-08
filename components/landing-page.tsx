"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, BarChart3, LogIn, UserPlus } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              RH
            </div>
            <h1 className="font-semibold text-foreground hidden sm:block">
              Registro de Horas
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/auth/login")}
              className="text-foreground hover:bg-secondary"
            >
              <LogIn className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Entrar</span>
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/auth/signup")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Cadastro</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Sistema de Registro de Horas Trabalhadas
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Gerenciamento eficiente de horas agrícolas. Registre seus trabalhos,
            consulte histórico e mantenha seus dados organizados.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Clock className="w-5 h-5 mr-2" />
              Registrar Horas Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/history")}
              className="border-border text-foreground hover:bg-secondary"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Consultar Registros
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-card border-border p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Registro Rápido
            </h3>
            <p className="text-sm text-muted-foreground">
              Registre suas horas trabalhadas através de um chatbot
              conversacional simples e intuitivo.
            </p>
          </Card>

          <Card className="bg-card border-border p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Histórico Completo
            </h3>
            <p className="text-sm text-muted-foreground">
              Consulte todos os seus registros com busca avançada, filtros e
              opção de exportação em CSV.
            </p>
          </Card>

          <Card className="bg-card border-border p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
              <LogIn className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Seguro e Simples
            </h3>
            <p className="text-sm text-muted-foreground">
              Acesso autenticado com dashboard personalizável e gerenciamento de
              conta integrado.
            </p>
          </Card>
        </div>
      </section>

      {/* How it works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 sm:mb-12 text-center">
          Como Funciona
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              step: "1",
              title: "Cadastro",
              desc: "Crie sua conta com email e senha",
            },
            {
              step: "2",
              title: "Chatbot",
              desc: "Responda perguntas do assistente",
            },
            {
              step: "3",
              title: "Confirmação",
              desc: "Revise e edite seus dados",
            },
            { step: "4", title: "Salvo", desc: "Seu registro está seguro" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Card className="bg-primary text-primary-foreground p-8 sm:p-12 border-0">
          <div className="text-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-balance">
              Comece Agora
            </h2>
            <p className="text-sm sm:text-base opacity-90 max-w-2xl mx-auto text-balance">
              Registre suas horas de trabalho de forma eficiente e acompanhe seu
              histórico completo em um único lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => router.push("/register")}
                variant="secondary"
              >
                Registrar Agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/auth/signup")}
                className="border-primary-foreground text-primary-foreground hover:bg-primary/20"
              >
                Criar Conta
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-12 sm:mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
            <p>
              © 2025 Registro de Horas Trabalhadas. Todos os direitos
              reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Termos
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
