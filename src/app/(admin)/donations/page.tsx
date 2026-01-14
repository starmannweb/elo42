"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    QrCode,
    Copy,
    Check,
    Loader2,
    CreditCard,
    Clock,
    DollarSign,
    ArrowUpRight,
    History
} from "lucide-react";
import { toast } from "sonner";

// Valores sugeridos para doação
const SUGGESTED_VALUES = [50, 100, 200, 500];

// Mock donations history
const mockDonations = [
    { id: "1", name: "Maria Silva", amount: 100, type: "pix", status: "paid", date: "2026-01-14" },
    { id: "2", name: "João Pedro", amount: 250, type: "pix", status: "paid", date: "2026-01-13" },
    { id: "3", name: "Ana Costa", amount: 50, type: "pix", status: "pending", date: "2026-01-13" },
    { id: "4", name: "Carlos Souza", amount: 500, type: "pix", status: "paid", date: "2026-01-12" },
    { id: "5", name: "Fernanda Lima", amount: 150, type: "pix", status: "expired", date: "2026-01-11" },
];

export default function DonationsPage() {
    const [activeTab, setActiveTab] = useState("new");
    const [amount, setAmount] = useState("");
    const [donorName, setDonorName] = useState("");
    const [description, setDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrDialogOpen, setQrDialogOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Mock QR Code data
    const [qrCodeData, setQrCodeData] = useState({
        pixCode: "",
        qrImageUrl: "",
        expiresAt: ""
    });

    const handleSelectAmount = (value: number) => {
        setAmount(String(value));
    };

    const handleGeneratePix = async () => {
        const value = parseFloat(amount);

        if (!value || value <= 0) {
            toast.error("Digite um valor válido");
            return;
        }

        setIsGenerating(true);

        // Simulando chamada à API
        setTimeout(() => {
            // Mock PIX code (em produção, viria da API Pagou)
            const mockPixCode = `00020126580014br.gov.bcb.pix0136${Date.now()}5204000053039865802BR5925IGREJA ELO 42 LTDA6009SAO PAULO62070503***63046E8B`;
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString("pt-BR");

            setQrCodeData({
                pixCode: mockPixCode,
                qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mockPixCode)}`,
                expiresAt
            });

            setIsGenerating(false);
            setQrDialogOpen(true);
        }, 1500);
    };

    const handleCopyPix = async () => {
        try {
            await navigator.clipboard.writeText(qrCodeData.pixCode);
            setCopied(true);
            toast.success("Código PIX copiado!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Erro ao copiar");
        }
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return <Badge className="bg-green-100 text-green-700">Pago</Badge>;
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>;
            case "expired":
                return <Badge className="bg-gray-100 text-gray-700">Expirado</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const stats = {
        total: mockDonations.filter(d => d.status === "paid").reduce((acc, d) => acc + d.amount, 0),
        pending: mockDonations.filter(d => d.status === "pending").length,
        thisMonth: mockDonations.filter(d => d.status === "paid").length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Doações Online</h2>
                    <p className="text-muted-foreground">Receba dízimos e ofertas via PIX</p>
                </div>
                <Badge className="bg-green-100 text-green-700 px-3 py-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    Integração Pagou Ativa
                </Badge>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Arrecadado (Mês)
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.total)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pagamentos Pendentes
                        </CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Doações Recebidas
                        </CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-[#004E7F]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.thisMonth}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="new">
                        <QrCode className="h-4 w-4 mr-2" />
                        Gerar PIX
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <History className="h-4 w-4 mr-2" />
                        Histórico
                    </TabsTrigger>
                </TabsList>

                {/* Gerar PIX */}
                <TabsContent value="new" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gerar QR Code PIX</CardTitle>
                            <CardDescription>
                                Crie um código PIX para receber uma doação
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Valores Sugeridos */}
                            <div className="space-y-2">
                                <Label>Valores sugeridos</Label>
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTED_VALUES.map((value) => (
                                        <Button
                                            key={value}
                                            variant={amount === String(value) ? "default" : "outline"}
                                            className={amount === String(value) ? "bg-[#004E7F] hover:bg-[#003d63]" : ""}
                                            onClick={() => handleSelectAmount(value)}
                                        >
                                            {formatCurrency(value)}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Valor Personalizado */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Valor (R$) *</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        placeholder="0,00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="donorName">Nome do Doador (opcional)</Label>
                                    <Input
                                        id="donorName"
                                        placeholder="Nome de quem está doando"
                                        value={donorName}
                                        onChange={(e) => setDonorName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição (opcional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Ex: Dízimo de Janeiro, Oferta missionária..."
                                    rows={2}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <Button
                                className="w-full bg-[#004E7F] hover:bg-[#003d63]"
                                size="lg"
                                onClick={handleGeneratePix}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Gerando PIX...
                                    </>
                                ) : (
                                    <>
                                        <QrCode className="mr-2 h-4 w-4" />
                                        Gerar QR Code PIX
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Histórico */}
                <TabsContent value="history" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Doações</CardTitle>
                            <CardDescription>
                                Todas as doações recebidas via PIX
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Doador</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Data</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockDonations.map((donation) => (
                                            <TableRow key={donation.id}>
                                                <TableCell className="font-medium">{donation.name}</TableCell>
                                                <TableCell>{formatCurrency(donation.amount)}</TableCell>
                                                <TableCell>{getStatusBadge(donation.status)}</TableCell>
                                                <TableCell>{new Date(donation.date).toLocaleDateString("pt-BR")}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* QR Code Dialog */}
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">PIX Gerado com Sucesso!</DialogTitle>
                        <DialogDescription className="text-center">
                            Escaneie o QR Code ou copie o código para pagar
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4 py-4">
                        {/* Valor */}
                        <div className="text-3xl font-bold text-[#004E7F]">
                            {formatCurrency(parseFloat(amount) || 0)}
                        </div>

                        {/* QR Code */}
                        <div className="bg-white p-4 rounded-lg border">
                            <img
                                src={qrCodeData.qrImageUrl}
                                alt="QR Code PIX"
                                className="w-48 h-48"
                            />
                        </div>

                        {/* Expira em */}
                        <p className="text-sm text-muted-foreground">
                            <Clock className="inline h-4 w-4 mr-1" />
                            Expira às {qrCodeData.expiresAt}
                        </p>

                        {/* Código PIX */}
                        <div className="w-full space-y-2">
                            <Label>Código PIX (Copia e Cola)</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={qrCodeData.pixCode}
                                    readOnly
                                    className="font-mono text-xs"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopyPix}
                                >
                                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-2 w-full">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setQrDialogOpen(false)}
                            >
                                Fechar
                            </Button>
                            <Button
                                className="flex-1 bg-[#004E7F] hover:bg-[#003d63]"
                                onClick={handleCopyPix}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copiar Código
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
