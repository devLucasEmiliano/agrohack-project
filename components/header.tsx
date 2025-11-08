"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 hover:bg-secondary rounded-md">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="text-foreground hover:bg-secondary"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </header>
  );
}
