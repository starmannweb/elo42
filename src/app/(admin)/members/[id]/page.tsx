"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    MapPin,
    Calendar,
    User,
    Loader2,
    Droplets
} from "lucide-react";
import { Member } from "@/types";
import { membersApi } from "@/lib/mock-data";

const statusConfig = {
    active: { label: "Ativo", color: "bg-green-100 text-green-700" },
    inactive: { label: "Inativo", color: "bg-gray-100 text-gray-700" },
    visitor: { label: "Visitante", color: "bg-blue-100 text-blue-700" }
};

export default function MemberDetailPage() {
    const params = useParams();
    const [member, setMember] = useState<Member | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadMember();
    }, [params.id]);

    const loadMember = async () => {
        setIsLoading(true);
        try {
            const data = await membersApi.getById(params.id as string);
            setMember(data || null);
        } catch (error) {
            console.error("Erro ao carregar membro:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("pt-BR");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="text-center py-20">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-1">Membro não encontrado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    O membro solicitado não existe ou foi removido.
                </p>
                <Link href="/members">
                    <Button>Voltar para lista</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/members">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold tracking-tight">{member.name}</h2>
                            <Badge className={statusConfig[member.status].color}>
                                {statusConfig[member.status].label}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">
                            Cadastrado em {formatDate(member.createdAt)}
                        </p>
                    </div>
                </div>
                <Link href={`/members/${member.id}/edit`}>
                    <Button className="bg-violet-600 hover:bg-violet-700">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Dados Pessoais */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dados Pessoais</CardTitle>
                        <CardDescription>Informações de contato e pessoais</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Telefone</p>
                                <p className="font-medium">{member.phone || "-"}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                                <Mail className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">E-mail</p>
                                <p className="font-medium">{member.email || "-"}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                                <p className="font-medium">{formatDate(member.birthDate)}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Endereço</p>
                                <p className="font-medium">{member.address || "-"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dados da Igreja */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dados da Igreja</CardTitle>
                        <CardDescription>Informações relacionadas à comunidade</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Droplets className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Data de Batismo</p>
                                <p className="font-medium">{formatDate(member.baptismDate || "")}</p>
                            </div>
                        </div>

                        {member.notes && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Observações</p>
                                    <p className="text-sm bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                        {member.notes}
                                    </p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
