"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    Calendar,
    DollarSign,
    Heart,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Plus
} from "lucide-react";
import Link from "next/link";

const stats = [
    {
        title: "Total de Membros",
        value: "248",
        change: "+12%",
        trend: "up",
        icon: Users,
        href: "/members"
    },
    {
        title: "Eventos Ativos",
        value: "5",
        change: "+2",
        trend: "up",
        icon: Calendar,
        href: "/events"
    },
    {
        title: "Saldo do Mês",
        value: "R$ 12.450",
        change: "+8%",
        trend: "up",
        icon: DollarSign,
        href: "/financial"
    },
    {
        title: "Solicitações Pendentes",
        value: "7",
        change: "-3",
        trend: "down",
        icon: Heart,
        href: "/requests"
    }
];

const recentRequests = [
    { id: 1, type: "Oração", name: "Maria Silva", date: "Hoje, 14:30", status: "pending" },
    { id: 2, type: "Batismo", name: "João Pedro", date: "Hoje, 10:15", status: "pending" },
    { id: 3, type: "Visita", name: "Ana Costa", date: "Ontem, 18:00", status: "in_progress" },
    { id: 4, type: "Oração", name: "Carlos Souza", date: "Ontem, 09:45", status: "completed" },
];

const upcomingEvents = [
    { id: 1, title: "Culto de Domingo", date: "19 Jan, 19:00", attendees: 45 },
    { id: 2, title: "Reunião de Líderes", date: "20 Jan, 20:00", attendees: 12 },
    { id: 3, title: "Encontro de Jovens", date: "21 Jan, 19:30", attendees: 28 },
];

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700"
};

const statusLabels = {
    pending: "Pendente",
    in_progress: "Em andamento",
    completed: "Concluído"
};

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Bem-vindo ao Elo 42</h2>
                <p className="text-muted-foreground">Visão geral da sua igreja hoje.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Link key={stat.title} href={stat.href}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-5 w-5 text-[#004E7F]" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="flex items-center gap-1 text-xs mt-1">
                                    {stat.trend === "up" ? (
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-red-600" />
                                    )}
                                    <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                                        {stat.change}
                                    </span>
                                    <span className="text-muted-foreground">vs mês anterior</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Two columns */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Requests */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Solicitações Recentes</CardTitle>
                            <CardDescription>Últimos pedidos de oração, batismo e visitas</CardDescription>
                        </div>
                        <Link href="/requests">
                            <Button variant="ghost" size="sm">
                                Ver todas
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentRequests.map((request) => (
                                <div key={request.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[#004E7F]/10 flex items-center justify-center">
                                            <Heart className="h-5 w-5 text-[#004E7F]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{request.name}</p>
                                            <p className="text-xs text-muted-foreground">{request.type} • {request.date}</p>
                                        </div>
                                    </div>
                                    <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                                        {statusLabels[request.status as keyof typeof statusLabels]}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Próximos Eventos</CardTitle>
                            <CardDescription>Eventos agendados para os próximos dias</CardDescription>
                        </div>
                        <Link href="/events">
                            <Button variant="ghost" size="sm">
                                Ver todos
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{event.title}</p>
                                            <p className="text-xs text-muted-foreground">{event.date}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">
                                        {event.attendees} inscritos
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <CardDescription>Acesso direto às funcionalidades mais usadas</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/members?new=true">
                            <Button className="bg-[#004E7F] hover:bg-[#003d63]">
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Membro
                            </Button>
                        </Link>
                        <Link href="/events?new=true">
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Evento
                            </Button>
                        </Link>
                        <Link href="/financial?new=true">
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Lançamento
                            </Button>
                        </Link>
                        <Link href="/sermons?new=true">
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Ministração
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
