"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Member } from "@/types";
import { membersApi } from "@/lib/mock-data";

export default function EditMemberPage() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        birthDate: "",
        address: "",
        status: "active" as "active" | "inactive" | "visitor",
        baptismDate: "",
        notes: ""
    });

    useEffect(() => {
        loadMember();
    }, [params.id]);

    const loadMember = async () => {
        setIsLoading(true);
        try {
            const member = await membersApi.getById(params.id as string);
            if (member) {
                setFormData({
                    name: member.name,
                    email: member.email || "",
                    phone: member.phone,
                    birthDate: member.birthDate || "",
                    address: member.address || "",
                    status: member.status,
                    baptismDate: member.baptismDate || "",
                    notes: member.notes || ""
                });
            }
        } catch (error) {
            console.error("Erro ao carregar membro:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone) {
            toast.error("Nome e telefone são obrigatórios");
            return;
        }

        setIsSaving(true);
        try {
            await membersApi.update(params.id as string, formData);
            toast.success("Membro atualizado com sucesso!");
            router.push(`/members/${params.id}`);
        } catch (error) {
            toast.error("Erro ao atualizar membro");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/members/${params.id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Editar Membro</h2>
                    <p className="text-muted-foreground">Atualize os dados do membro</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Dados Pessoais */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados Pessoais</CardTitle>
                            <CardDescription>Informações básicas do membro</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo *</Label>
                                <Input
                                    id="name"
                                    placeholder="Nome do membro"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone *</Label>
                                    <Input
                                        id="phone"
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@exemplo.com"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => handleChange("birthDate", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleChange("status", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Ativo</SelectItem>
                                            <SelectItem value="inactive">Inativo</SelectItem>
                                            <SelectItem value="visitor">Visitante</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Endereço</Label>
                                <Input
                                    id="address"
                                    placeholder="Rua, número, bairro, cidade"
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dados da Igreja */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados da Igreja</CardTitle>
                            <CardDescription>Informações relacionadas à igreja</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="baptismDate">Data de Batismo</Label>
                                <Input
                                    id="baptismDate"
                                    type="date"
                                    value={formData.baptismDate}
                                    onChange={(e) => handleChange("baptismDate", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Observações</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Anotações sobre o membro..."
                                    rows={5}
                                    value={formData.notes}
                                    onChange={(e) => handleChange("notes", e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6">
                    <Link href={`/members/${params.id}`}>
                        <Button variant="outline" type="button">
                            Cancelar
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        className="bg-violet-600 hover:bg-violet-700"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Salvar Alterações
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
