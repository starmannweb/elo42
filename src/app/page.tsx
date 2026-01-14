"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Church,
  Users,
  Calendar,
  DollarSign,
  Headphones,
  Heart,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestão de Membros",
    description: "Cadastro completo de membros com histórico e acompanhamento pastoral."
  },
  {
    icon: Calendar,
    title: "Eventos e Agenda",
    description: "Organize eventos, cultos e atividades com inscrições online."
  },
  {
    icon: DollarSign,
    title: "Controle Financeiro",
    description: "Gerencie dízimos, ofertas, despesas e gere relatórios detalhados."
  },
  {
    icon: Headphones,
    title: "Ministrações",
    description: "Biblioteca de sermões em áudio e vídeo para sua comunidade."
  },
  {
    icon: Heart,
    title: "Solicitações",
    description: "Pedidos de oração, batismo e visitas em um só lugar."
  },
  {
    icon: Sparkles,
    title: "100% Gratuito",
    description: "Sistema completo sem custos de hospedagem ou mensalidades."
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-950/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Church className="h-8 w-8 text-violet-600" />
            <span className="font-bold text-xl">Elo 42</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Recursos
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition">
              Sobre
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-violet-600 hover:bg-violet-700">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          Sistema 100% Gratuito
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-800 bg-clip-text text-transparent">
          Gestão completa para<br />sua igreja
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Organize membros, eventos, finanças e ministrações em uma plataforma
          moderna e fácil de usar. Feito para igrejas de todos os tamanhos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-lg px-8">
              Criar Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Acessar Painel
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Sem cartão de crédito
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Setup em 5 minutos
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tudo que sua igreja precisa</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Uma plataforma completa para gerenciar todos os aspectos da sua comunidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-900/80 backdrop-blur">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-violet-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-violet-600 to-purple-700 border-0 text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para transformar a gestão da sua igreja?
            </h2>
            <p className="text-violet-100 mb-8 max-w-xl mx-auto">
              Comece gratuitamente hoje e veja como o Elo 42 pode ajudar sua comunidade a crescer.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-950/80 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Church className="h-6 w-6 text-violet-600" />
              <span className="font-bold">Elo 42</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Elo 42. Sistema de gestão para igrejas.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
