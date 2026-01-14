"use client";

import { useState, useEffect } from "react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Headphones,
    Video,
    Play,
    Clock,
    Calendar,
    User,
    Loader2,
    Edit,
    Trash2,
    Youtube,
    Music
} from "lucide-react";
import { toast } from "sonner";

interface Sermon {
    id: string;
    title: string;
    description: string;
    preacher: string;
    mediaUrl: string;
    mediaType: 'audio' | 'video' | 'youtube';
    sermonDate: string;
    durationMinutes: number;
    createdAt: string;
}

const mockSermons: Sermon[] = [
    {
        id: "1",
        title: "O Poder da Fé",
        description: "Mensagem sobre como a fé pode mover montanhas em nossa vida",
        preacher: "Pr. João Silva",
        mediaUrl: "https://www.youtube.com/watch?v=example1",
        mediaType: "youtube",
        sermonDate: "2026-01-12",
        durationMinutes: 45,
        createdAt: "2026-01-12T21:00:00Z"
    },
    {
        id: "2",
        title: "Vivendo em Comunidade",
        description: "A importância de viver em comunhão uns com os outros",
        preacher: "Pra. Maria Santos",
        mediaUrl: "https://example.com/audio/sermon2.mp3",
        mediaType: "audio",
        sermonDate: "2026-01-08",
        durationMinutes: 38,
        createdAt: "2026-01-08T21:00:00Z"
    },
    {
        id: "3",
        title: "Promessas de Deus",
        description: "Estudo sobre as promessas de Deus para nossa vida",
        preacher: "Pr. João Silva",
        mediaUrl: "https://www.youtube.com/watch?v=example2",
        mediaType: "youtube",
        sermonDate: "2026-01-05",
        durationMinutes: 52,
        createdAt: "2026-01-05T21:00:00Z"
    },
    {
        id: "4",
        title: "O Amor Incondicional",
        description: "Reflexão sobre o amor de Deus que nunca falha",
        preacher: "Ev. Carlos Mendes",
        mediaUrl: "https://example.com/video/sermon4.mp4",
        mediaType: "video",
        sermonDate: "2026-01-01",
        durationMinutes: 40,
        createdAt: "2026-01-01T21:00:00Z"
    }
];

const mediaTypeConfig = {
    audio: { label: "Áudio", icon: Music, color: "bg-green-100 text-green-700" },
    video: { label: "Vídeo", icon: Video, color: "bg-blue-100 text-blue-700" },
    youtube: { label: "YouTube", icon: Youtube, color: "bg-red-100 text-red-700" }
};

export default function SermonsPage() {
    const [sermons, setSermons] = useState<Sermon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sermonToDelete, setSermonToDelete] = useState<Sermon | null>(null);
    const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        preacher: "",
        mediaUrl: "",
        mediaType: "youtube" as "audio" | "video" | "youtube",
        sermonDate: new Date().toISOString().split("T")[0],
        durationMinutes: 30
    });

    useEffect(() => {
        setTimeout(() => {
            setSermons(mockSermons);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleOpenDialog = (sermon?: Sermon) => {
        if (sermon) {
            setEditingSermon(sermon);
            setFormData({
                title: sermon.title,
                description: sermon.description,
                preacher: sermon.preacher,
                mediaUrl: sermon.mediaUrl,
                mediaType: sermon.mediaType,
                sermonDate: sermon.sermonDate,
                durationMinutes: sermon.durationMinutes
            });
        } else {
            setEditingSermon(null);
            setFormData({
                title: "",
                description: "",
                preacher: "",
                mediaUrl: "",
                mediaType: "youtube",
                sermonDate: new Date().toISOString().split("T")[0],
                durationMinutes: 30
            });
        }
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.preacher) {
            toast.error("Preencha os campos obrigatórios");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            if (editingSermon) {
                setSermons(prev => prev.map(s =>
                    s.id === editingSermon.id
                        ? { ...s, ...formData }
                        : s
                ));
                toast.success("Ministração atualizada com sucesso!");
            } else {
                const newSermon: Sermon = {
                    id: String(Date.now()),
                    ...formData,
                    createdAt: new Date().toISOString()
                };
                setSermons(prev => [newSermon, ...prev]);
                toast.success("Ministração adicionada com sucesso!");
            }
            setDialogOpen(false);
            setIsSubmitting(false);
        }, 500);
    };

    const handleDelete = () => {
        if (!sermonToDelete) return;
        setSermons(prev => prev.filter(s => s.id !== sermonToDelete.id));
        toast.success("Ministração excluída");
        setDeleteDialogOpen(false);
        setSermonToDelete(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ministrações</h2>
                    <p className="text-muted-foreground">Sermões e pregações da igreja</p>
                </div>
                <Button
                    className="bg-violet-600 hover:bg-violet-700"
                    onClick={() => handleOpenDialog()}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Ministração
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                        <Headphones className="h-4 w-4 text-violet-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sermons.length}</div>
                        <p className="text-xs text-muted-foreground">ministrações</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Este Mês</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {sermons.filter(s => {
                                const date = new Date(s.sermonDate);
                                const now = new Date();
                                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                            }).length}
                        </div>
                        <p className="text-xs text-muted-foreground">novas ministrações</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Duração Total</CardTitle>
                        <Clock className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(sermons.reduce((acc, s) => acc + s.durationMinutes, 0) / 60)}h
                        </div>
                        <p className="text-xs text-muted-foreground">de conteúdo</p>
                    </CardContent>
                </Card>
            </div>

            {/* Sermons Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                </div>
            ) : sermons.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-10">
                        <Headphones className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-1">Nenhuma ministração</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Adicione a primeira ministração da sua igreja
                        </p>
                        <Button
                            className="bg-violet-600 hover:bg-violet-700"
                            onClick={() => handleOpenDialog()}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Ministração
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sermons.map((sermon) => {
                        const MediaIcon = mediaTypeConfig[sermon.mediaType].icon;
                        return (
                            <Card key={sermon.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <Badge className={mediaTypeConfig[sermon.mediaType].color}>
                                            <MediaIcon className="h-3 w-3 mr-1" />
                                            {mediaTypeConfig[sermon.mediaType].label}
                                        </Badge>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleOpenDialog(sermon)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-600"
                                                onClick={() => {
                                                    setSermonToDelete(sermon);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg mt-2">{sermon.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {sermon.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>{sermon.preacher}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{formatDate(sermon.sermonDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{sermon.durationMinutes} minutos</span>
                                    </div>
                                    <Button className="w-full mt-2" variant="outline">
                                        <Play className="h-4 w-4 mr-2" />
                                        Reproduzir
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingSermon ? "Editar Ministração" : "Nova Ministração"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSermon
                                ? "Atualize as informações da ministração"
                                : "Adicione uma nova ministração ao acervo"
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
                            <Label htmlFor="preacher">Pregador *</Label>
                            <Input
                                id="preacher"
                                placeholder="Nome do pregador"
                                value={formData.preacher}
                                onChange={(e) => setFormData(prev => ({ ...prev, preacher: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                rows={2}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="mediaType">Tipo de Mídia</Label>
                                <Select
                                    value={formData.mediaType}
                                    onValueChange={(value: "audio" | "video" | "youtube") =>
                                        setFormData(prev => ({ ...prev, mediaType: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="youtube">YouTube</SelectItem>
                                        <SelectItem value="video">Vídeo (Upload)</SelectItem>
                                        <SelectItem value="audio">Áudio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="durationMinutes">Duração (min)</Label>
                                <Input
                                    id="durationMinutes"
                                    type="number"
                                    min={1}
                                    value={formData.durationMinutes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mediaUrl">URL da Mídia</Label>
                            <Input
                                id="mediaUrl"
                                placeholder={formData.mediaType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
                                value={formData.mediaUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, mediaUrl: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sermonDate">Data da Ministração</Label>
                            <Input
                                id="sermonDate"
                                type="date"
                                value={formData.sermonDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, sermonDate: e.target.value }))}
                            />
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                {editingSermon ? "Salvar Alterações" : "Adicionar"}
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
                            Tem certeza que deseja excluir a ministração <strong>{sermonToDelete?.title}</strong>?
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
