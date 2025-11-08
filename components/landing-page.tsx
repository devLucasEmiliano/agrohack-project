"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, FileText, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particles configuration
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];
    const particleCount = 80;
    const maxDistance = 150;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, 0.5)";
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const opacity = (1 - distance / maxDistance) * 0.3;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const redirectTo = (target: string) =>
    `/auth/login?redirect=${encodeURIComponent(target)}`;

  const handleDashboardClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push(redirectTo("/dashboard"));
    }
  };

  const handleRegisterClick = () => {
    if (user) {
      router.push("/dashboard/register");
    } else {
      router.push(redirectTo("/dashboard/register"));
    }
  };

  const handleConsultClick = () => {
    if (user) {
      router.push("/dashboard/consult");
    } else {
      router.push("/consultHours");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.4 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg text-sm">
                Agro
              </div>
              <h1 className="font-bold text-lg text-foreground">RHT</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleDashboardClick}>
                <LogIn className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button size="sm" onClick={() => router.push("/auth/signup")}>
                <UserPlus className="w-4 h-4 mr-2" />
                Cadastrar
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6">
          <div className="text-center space-y-12 w-full max-w-5xl">
            {/* Hero Section */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                Sistema de Registro de Horas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Gerencie suas horas trabalhadas de forma simples e eficiente
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card
                className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary group"
                onClick={handleRegisterClick}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Registrar Horas
                  </h3>
                  <p className="text-muted-foreground">
                    Registre suas horas trabalhadas de forma rápida e intuitiva
                  </p>
                  <Button className="w-full mt-4" size="lg">
                    Começar Registro
                  </Button>
                </div>
              </Card>

              <Card
                className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary group"
                onClick={handleConsultClick}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Consultar Folha de Horas
                  </h3>
                  <p className="text-muted-foreground">
                    Consulte o histórico completo de horas trabalhadas
                  </p>
                  <Button variant="outline" className="w-full mt-4" size="lg">
                    Consultar Agora
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
