"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Calendar,
    MapPin,
    Users,
    Clock,
    MoreHorizontal,
    Edit,
    Trash2,
    Loader2,
    CalendarDays
} from "lucide-react";
import { toast } from "sonner";

interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    maxCapacity: number;
    registrations: number;
    active: boolean;
}

// Mock data
const mockEvents: Event[] = [
    {
        id: "1",
        title: "Culto de Domingo",
        description: "Culto dominical com louvor e pregação",
        startDate: "2026-01-19T19:00:00",
        endDate: "2026-01-19T21:00:00",
        location: "Templo Principal",
        maxCapacity: 200,
        registrations: 145,
        active: true
    },
    {
        id: "2",
        title: "Reunião de Líderes",
        description: "Reunião mensal com todos os líderes de célula",
        startDate: "2026-01-20T20:00:00",
        endDate: "2026-01-20T22:00:00",
        location: "Sala de Reuniões",
        maxCapacity: 30,
        registrations: 24,
        active: true
    },
    {
        id: "3",
        title: "Encontro de Jovens",
        description: "Momento especial para jovens com louvor e dinâmicas",
        startDate: "2026-01-21T19:30:00",
        endDate: "2026-01-21T22:00:00",
        location: "Salão de Festas",
        maxCapacity: 100,
        registrations: 67,
        active: true
    },
    {
        id: "4",
        title: "Escola Bíblica Dominical",
        description: "Estudo bíblico por faixas etárias",
        startDate: "2026-01-26T09:00:00",
        endDate: "2026-01-26T10:30:00",
        location: "Salas de Aula",
        maxCapacity: 150,
        registrations: 89,
        active: true
    },
    {
        id: "5",
        title: "Retiro de Casais",
        description: "Final de semana especial para casais",
        startDate: "2026-02-14T18:00:00",
        endDate: "2026-02-16T12:00:00",
        location: "Chácara Shalom",
        maxCapacity: 40,
        registrations: 32,
        active: true
    }
];

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        maxCapacity: 100
    });

    useEffect(() => {
        setTimeout(() => {
            setEvents(mockEvents);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleOpenDialog = (event?: Event) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                title: event.title,
                description: event.description,
                startDate: event.startDate.slice(0, 16),
                endDate: event.endDate.slice(0, 16),
                location: event.location,
                maxCapacity: event.maxCapacity
            });
        } else {
            setEditingEvent(null);
            setFormData({
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                location: "",
                maxCapacity: 100
            });
        }
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            if (editingEvent) {
                setEvents(prev => prev.map(ev =>
                    ev.id === editingEvent.id
                        ? { ...ev, ...formData }
                        : ev
                ));
                toast.success("Evento atualizado com sucesso!");
            } else {
                const newEvent: Event = {
                    id: String(Date.now()),
                    ...formData,
                    registrations: 0,
                    active: true
                };
                setEvents(prev => [...prev, newEvent]);
                toast.success("Evento criado com sucesso!");
            }
            setDialogOpen(false);
            setIsSubmitting(false);
        }, 500);
    };

    const handleDelete = () => {
        if (!eventToDelete) return;

        setEvents(prev => prev.filter(ev => ev.id !== eventToDelete.id));
        toast.success("Evento excluído com sucesso");
        setDeleteDialogOpen(false);
        setEventToDelete(null);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const upcomingEvents = events.filter(e => new Date(e.startDate) >= new Date());
    const pastEvents = events.filter(e => new Date(e.startDate) < new Date());

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Eventos</h2>
                    <p className="text-muted-foreground">Gerencie os eventos e atividades da igreja</p>
                </div>
                <Button
                    className="bg-violet-600 hover:bg-violet-700"
                    onClick={() => handleOpenDialog()}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Evento
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Eventos Ativos
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-violet-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingEvents.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total de Inscritos
                        </CardTitle>
                        <Users className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {events.reduce((acc, e) => acc + e.registrations, 0)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Próximo Evento
                        </CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold truncate">
                            {upcomingEvents[0]?.title || "Nenhum"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Events List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                </div>
            ) : events.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-10">
                        <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-1">Nenhum evento cadastrado</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Comece criando o primeiro evento da sua igreja
                        </p>
                        <Button
                            className="bg-violet-600 hover:bg-violet-700"
                            onClick={() => handleOpenDialog()}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Criar Evento
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event) => (
                        <Card key={event.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <Badge className="bg-green-100 text-green-700 mb-2">Próximo</Badge>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleOpenDialog(event)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-600"
                                            onClick={() => {
                                                setEventToDelete(event);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {event.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{formatDate(event.startDate)} às {formatTime(event.startDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{event.registrations} / {event.maxCapacity} inscritos</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-violet-600 h-2 rounded-full transition-all"
                                        style={{ width: `${(event.registrations / event.maxCapacity) * 100}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingEvent ? "Editar Evento" : "Novo Evento"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingEvent
                                ? "Atualize as informações do evento"
                                : "Preencha os dados para criar um novo evento"
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Início *</Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Término *</Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="location">Local</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxCapacity">Capacidade</Label>
                                <Input
                                    id="maxCapacity"
                                    type="number"
                                    min={1}
                                    value={formData.maxCapacity}
                                    onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-violet-600 hover:bg-violet-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    editingEvent ? "Salvar Alterações" : "Criar Evento"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir o evento <strong>{eventToDelete?.title}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
