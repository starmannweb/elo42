"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BarChart3,
    PieChart as PieChartIcon,
    TrendingUp,
    Users,
    Calendar,
    DollarSign,
    FileDown,
    Loader2
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart
} from "recharts";
import { generatePDFReport } from "@/lib/pdf-reports";
import { toast } from "sonner";

// Mock data para os gráficos
const monthlyFinanceData = [
    { month: "Jan", receitas: 15000, despesas: 8500 },
    { month: "Fev", receitas: 18000, despesas: 9200 },
    { month: "Mar", receitas: 16500, despesas: 8800 },
    { month: "Abr", receitas: 21000, despesas: 10500 },
    { month: "Mai", receitas: 19500, despesas: 9800 },
    { month: "Jun", receitas: 23000, despesas: 11000 },
];

const membersByStatusData = [
    { name: "Ativos", value: 248, color: "#22c55e" },
    { name: "Inativos", value: 45, color: "#ef4444" },
    { name: "Visitantes", value: 82, color: "#f59e0b" },
];

const membersByAgeData = [
    { faixa: "0-18", quantidade: 45 },
    { faixa: "19-30", quantidade: 85 },
    { faixa: "31-45", quantidade: 95 },
    { faixa: "46-60", quantidade: 68 },
    { faixa: "60+", quantidade: 55 },
];

const eventAttendanceData = [
    { evento: "Culto Domingo", participantes: 180, capacidade: 200 },
    { evento: "Culto Quarta", participantes: 95, capacidade: 150 },
    { evento: "Escola Bíblica", participantes: 65, capacidade: 80 },
    { evento: "Jovens", participantes: 45, capacidade: 60 },
    { evento: "Mulheres", participantes: 38, capacidade: 50 },
];

const donationTypesData = [
    { name: "Dízimos", value: 65, color: "#004E7F" },
    { name: "Ofertas", value: 20, color: "#D4A84B" },
    { name: "Campanhas", value: 10, color: "#22c55e" },
    { name: "Doações", value: 5, color: "#8b5cf6" },
];

const weeklyGrowthData = [
    { semana: "Sem 1", membros: 340, visitantes: 15 },
    { semana: "Sem 2", membros: 345, visitantes: 22 },
    { semana: "Sem 3", membros: 352, visitantes: 18 },
    { semana: "Sem 4", membros: 365, visitantes: 25 },
    { semana: "Sem 5", membros: 375, visitantes: 20 },
];

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [period, setPeriod] = useState("6m");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const totalReceitas = monthlyFinanceData.reduce((acc, d) => acc + d.receitas, 0);
    const totalDespesas = monthlyFinanceData.reduce((acc, d) => acc + d.despesas, 0);
    const totalMembros = membersByStatusData.reduce((acc, d) => acc + d.value, 0);

    const handleExportPDF = (type: string) => {
        let data: Record<string, unknown>[] = [];
        let columns: { header: string; dataKey: string }[] = [];
        let title = "";

        switch (type) {
            case "finance":
                data = monthlyFinanceData.map(d => ({
                    month: d.month,
                    receitas: formatCurrency(d.receitas),
                    despesas: formatCurrency(d.despesas),
                    saldo: formatCurrency(d.receitas - d.despesas)
                }));
                columns = [
                    { header: "Mês", dataKey: "month" },
                    { header: "Receitas", dataKey: "receitas" },
                    { header: "Despesas", dataKey: "despesas" },
                    { header: "Saldo", dataKey: "saldo" }
                ];
                title = "Relatório Financeiro Mensal";
                break;
            case "members":
                data = membersByStatusData.map(d => ({
                    status: d.name,
                    quantidade: d.value,
                    percentual: ((d.value / totalMembros) * 100).toFixed(1) + "%"
                }));
                columns = [
                    { header: "Status", dataKey: "status" },
                    { header: "Quantidade", dataKey: "quantidade" },
                    { header: "Percentual", dataKey: "percentual" }
                ];
                title = "Relatório de Membros por Status";
                break;
            case "events":
                data = eventAttendanceData.map(d => ({
                    evento: d.evento,
                    participantes: d.participantes,
                    capacidade: d.capacidade,
                    ocupacao: ((d.participantes / d.capacidade) * 100).toFixed(0) + "%"
                }));
                columns = [
                    { header: "Evento", dataKey: "evento" },
                    { header: "Participantes", dataKey: "participantes" },
                    { header: "Capacidade", dataKey: "capacidade" },
                    { header: "Ocupação", dataKey: "ocupacao" }
                ];
                title = "Relatório de Participação em Eventos";
                break;
        }

        generatePDFReport({
            title,
            subtitle: `Período: Últimos 6 meses`,
            columns,
            data,
            filename: `relatorio-${type}-${new Date().toISOString().slice(0, 10)}`
        });
        toast.success("PDF gerado com sucesso!");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#004E7F]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Relatórios</h2>
                    <p className="text-muted-foreground">Análises e métricas da igreja</p>
                </div>
                <div className="flex gap-2">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1m">Último mês</SelectItem>
                            <SelectItem value="3m">Últimos 3 meses</SelectItem>
                            <SelectItem value="6m">Últimos 6 meses</SelectItem>
                            <SelectItem value="1y">Último ano</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Membros</CardTitle>
                        <Users className="h-4 w-4 text-[#004E7F]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMembros}</div>
                        <p className="text-xs text-green-600">+12% vs período anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalReceitas)}</div>
                        <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
                        <DollarSign className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</div>
                        <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Média Eventos</CardTitle>
                        <Calendar className="h-4 w-4 text-[#D4A84B]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">Ocupação média</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="overview">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Visão Geral
                    </TabsTrigger>
                    <TabsTrigger value="finance">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Financeiro
                    </TabsTrigger>
                    <TabsTrigger value="members">
                        <Users className="h-4 w-4 mr-2" />
                        Membros
                    </TabsTrigger>
                    <TabsTrigger value="events">
                        <Calendar className="h-4 w-4 mr-2" />
                        Eventos
                    </TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="space-y-4 mt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Receitas vs Despesas */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Receitas vs Despesas</CardTitle>
                                    <CardDescription>Comparativo mensal</CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExportPDF("finance")}
                                >
                                    <FileDown className="h-4 w-4 mr-1" />
                                    PDF
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyFinanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(v) => `R$${v / 1000}k`} />
                                        <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                                        <Legend />
                                        <Bar dataKey="receitas" name="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Membros por Status */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Membros por Status</CardTitle>
                                    <CardDescription>Distribuição atual</CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleExportPDF("members")}
                                >
                                    <FileDown className="h-4 w-4 mr-1" />
                                    PDF
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={membersByStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            dataKey="value"
                                        >
                                            {membersByStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Crescimento */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Crescimento Semanal</CardTitle>
                            <CardDescription>Membros e visitantes ao longo do tempo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={weeklyGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="semana" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="membros" name="Membros" stackId="1" stroke="#004E7F" fill="#004E7F" fillOpacity={0.6} />
                                    <Area type="monotone" dataKey="visitantes" name="Visitantes" stackId="2" stroke="#D4A84B" fill="#D4A84B" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Financeiro */}
                <TabsContent value="finance" className="space-y-4 mt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Receitas por Categoria</CardTitle>
                                <CardDescription>Distribuição de entradas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={donationTypesData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            dataKey="value"
                                        >
                                            {donationTypesData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Evolução do Saldo</CardTitle>
                                <CardDescription>Resultado mensal acumulado</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyFinanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(v) => `R$${v / 1000}k`} />
                                        <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                                        <Line
                                            type="monotone"
                                            dataKey="receitas"
                                            name="Receitas"
                                            stroke="#22c55e"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="despesas"
                                            name="Despesas"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Membros */}
                <TabsContent value="members" className="space-y-4 mt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Membros por Faixa Etária</CardTitle>
                                <CardDescription>Distribuição demográfica</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={membersByAgeData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="faixa" type="category" width={60} />
                                        <Tooltip />
                                        <Bar dataKey="quantidade" name="Membros" fill="#004E7F" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Status dos Membros</CardTitle>
                                <CardDescription>Situação cadastral</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {membersByStatusData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold">{item.value}</span>
                                            <Badge variant="secondary">
                                                {((item.value / totalMembros) * 100).toFixed(1)}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Eventos */}
                <TabsContent value="events" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Participação em Eventos</CardTitle>
                                <CardDescription>Comparativo de ocupação</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExportPDF("events")}
                            >
                                <FileDown className="h-4 w-4 mr-1" />
                                PDF
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={eventAttendanceData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="evento" type="category" width={120} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="participantes" name="Participantes" fill="#004E7F" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="capacidade" name="Capacidade" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
