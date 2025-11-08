import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

import { Inter } from "next/font/google";

// Single font usage (others removed to avoid unused variable warnings)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Registro de Horas Trabalhadas",
  description: "Sistema de Gerenciamento de Horas Agrícolas",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased ${inter.className}`}>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
