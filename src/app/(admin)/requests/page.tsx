"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Heart,
    Droplets,
    Home,
    MessageCircle,
    MoreHorizontal,
    CheckCircle,
    Clock,
    XCircle,
    Loader2,
    Plus,
    User
} from "lucide-react";
import { toast } from "sonner";

interface Request {
    id: string;
    memberName: string;
    type: 'prayer' | 'baptism' | 'visit' | 'counseling' | 'other';
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    responseNotes?: string;
    createdAt: string;
    completedAt?: string;
}

const typeConfig = {
    prayer: { label: "Oração", icon: Heart, color: "bg-red-100 text-red-700" },
    baptism: { label: "Batismo", icon: Droplets, color: "bg-blue-100 text-blue-700" },
    visit: { label: "Visita", icon: Home, color: "bg-green-100 text-green-700" },
    counseling: { label: "Aconselhamento", icon: MessageCircle, color: "bg-purple-100 text-purple-700" },
    other: { label: "Outro", icon: MoreHorizontal, color: "bg-gray-100 text-gray-700" }
};

const statusConfig = {
    pending: { label: "Pendente", icon: Clock, color: "bg-yellow-100 text-yellow-700" },
    in_progress: { label: "Em andamento", icon: Loader2, color: "bg-blue-100 text-blue-700" },
    completed: { label: "Concluído", icon: CheckCircle, color: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelado", icon: XCircle, color: "bg-gray-100 text-gray-700" }
};

const mockRequests: Request[] = [
    {
        id: "1",
        memberName: "Maria Silva",
        type: "prayer",
        description: "Peço orações pela saúde do meu pai que está internado",
        status: "pending",
        createdAt: "2026-01-14T14:30:00Z"
    },
    {
        id: "2",
        memberName: "João Pedro",
        type: "baptism",
        description: "Gostaria de me batizar. Tenho 6 meses de fé",
        status: "pending",
        createdAt: "2026-01-14T10:15:00Z"
    },
    {
        id: "3",
        memberName: "Ana Costa",
        type: "visit",
        description: "Solicito visita pastoral, estou passando por um momento difícil",
        status: "in_progress",
        responseNotes: "Visita agendada para quinta-feira às 15h",
        createdAt: "2026-01-13T18:00:00Z"
    },
    {
        id: "4",
        memberName: "Carlos Souza",
        type: "prayer",
        description: "Orações pela minha família, estamos em crise financeira",
        status: "completed",
        responseNotes: "Oração feita no culto de quarta-feira",
        createdAt: "2026-01-12T09:45:00Z",
        completedAt: "2026-01-14T20:00:00Z"
    },
    {
        id: "5",
        memberName: "Fernanda Rodrigues",
        type: "counseling",
        description: "Preciso de orientação sobre decisão de carreira",
        status: "pending",
        createdAt: "2026-01-14T08:20:00Z"
    }
];

export default function RequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pending");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [responseNotes, setResponseNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setRequests(mockRequests);
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredRequests = requests.filter(r => {
        if (activeTab === "pending") return r.status === "pending";
        if (activeTab === "in_progress") return r.status === "in_progress";
        if (activeTab === "completed") return r.status === "completed" || r.status === "cancelled";
        return true;
    });

    const handleOpenDialog = (request: Request) => {
        setSelectedRequest(request);
        setResponseNotes(request.responseNotes || "");
        setDialogOpen(true);
    };

    const handleUpdateStatus = async (newStatus: Request['status']) => {
        if (!selectedRequest) return;

        setIsSubmitting(true);
        setTimeout(() => {
            setRequests(prev => prev.map(r =>
                r.id === selectedRequest.id
                    ? {
                        ...r,
                        status: newStatus,
                        responseNotes,
                        completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
                    }
                    : r
            ));
            toast.success("Status atualizado com sucesso!");
            setDialogOpen(false);
            setIsSubmitting(false);
        }, 500);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Hoje";
        if (diffDays === 1) return "Ontem";
        return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    };

    const stats = {
        pending: requests.filter(r => r.status === "pending").length,
        inProgress: requests.filter(r => r.status === "in_progress").length,
        completed: requests.filter(r => r.status === "completed").length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Solicitações</h2>
                    <p className="text-muted-foreground">
                        Gerencie pedidos de oração, batismo, visitas e aconselhamento
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
                        <Loader2 className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Concluídos</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="pending">
                        Pendentes ({stats.pending})
                    </TabsTrigger>
                    <TabsTrigger value="in_progress">
                        Em Andamento ({stats.inProgress})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        Concluídos ({stats.completed})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-10">
                                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="font-semibold mb-1">Nenhuma solicitação</h3>
                                <p className="text-sm text-muted-foreground">
                                    Não há solicitações {activeTab === "pending" ? "pendentes" : activeTab === "in_progress" ? "em andamento" : "concluídas"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredRequests.map((request) => {
                                const TypeIcon = typeConfig[request.type].icon;
                                const StatusIcon = statusConfig[request.status].icon;

                                return (
                                    <Card
                                        key={request.id}
                                        className="hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => handleOpenDialog(request)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${typeConfig[request.type].color}`}>
                                                    <TypeIcon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium">{request.memberName}</span>
                                                        <Badge className={typeConfig[request.type].color}>
                                                            {typeConfig[request.type].label}
                                                        </Badge>
                                                        <Badge className={statusConfig[request.status].color}>
                                                            {statusConfig[request.status].label}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {request.description}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        {formatDate(request.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Detail/Action Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedRequest && (
                                <>
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ${typeConfig[selectedRequest.type].color}`}>
                                        {(() => {
                                            const Icon = typeConfig[selectedRequest.type].icon;
                                            return <Icon className="h-4 w-4" />;
                                        })()}
                                    </span>
                                    {typeConfig[selectedRequest?.type || 'other'].label}
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Solicitação de {selectedRequest?.memberName}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-1">Descrição</p>
                                <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                    {selectedRequest.description}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium mb-1">Status Atual</p>
                                <Badge className={statusConfig[selectedRequest.status].color}>
                                    {statusConfig[selectedRequest.status].label}
                                </Badge>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Observações / Resposta</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Adicione observações sobre o atendimento..."
                                    rows={3}
                                    value={responseNotes}
                                    onChange={(e) => setResponseNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        {selectedRequest?.status === 'pending' && (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                    onClick={() => handleUpdateStatus('in_progress')}
                                    disabled={isSubmitting}
                                >
                                    Iniciar Atendimento
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleUpdateStatus('completed')}
                                    disabled={isSubmitting}
                                >
                                    Marcar como Concluído
                                </Button>
                            </>
                        )}
                        {selectedRequest?.status === 'in_progress' && (
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleUpdateStatus('completed')}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                Concluir Atendimento
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
