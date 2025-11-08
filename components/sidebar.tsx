"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Clock, FileText, BarChart3, Settings } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Registrar Horas",
    href: "/dashboard/register",
    icon: Clock,
  },
  {
    name: "Histórico",
    href: "/dashboard/history",
    icon: FileText,
  },
  {
    name: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex w-64 flex-col bg-card border-r border-border">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Registro de Horas</h1>
        <p className="text-xs text-muted-foreground">Gerenciamento Agrícola</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
