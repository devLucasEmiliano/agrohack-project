"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas configurações de conta
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Informações da Conta</CardTitle>
              <CardDescription>Seus dados de usuário</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Nome</p>
            <p className="text-base font-semibold text-foreground">
              {user?.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Email</p>
            <p className="text-base font-semibold text-foreground">
              {user?.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              Membro desde
            </p>
            <p className="text-base font-semibold text-foreground">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">
            Sair da Conta
          </CardTitle>
          <CardDescription>
            Você será desconectado e redirecionado para o login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
