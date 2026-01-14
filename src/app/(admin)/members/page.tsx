"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Users,
    UserCheck,
    UserX,
    UserPlus,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Member } from "@/types";
import { membersApi } from "@/lib/mock-data";

const statusConfig = {
    active: { label: "Ativo", color: "bg-green-100 text-green-700" },
    inactive: { label: "Inativo", color: "bg-gray-100 text-gray-700" },
    visitor: { label: "Visitante", color: "bg-blue-100 text-blue-700" }
};

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Load members
    useEffect(() => {
        loadMembers();
    }, []);

    // Filter members
    useEffect(() => {
        let filtered = members;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(m =>
                m.name.toLowerCase().includes(term) ||
                m.email.toLowerCase().includes(term) ||
                m.phone.includes(term)
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(m => m.status === statusFilter);
        }

        setFilteredMembers(filtered);
    }, [members, searchTerm, statusFilter]);

    const loadMembers = async () => {
        setIsLoading(true);
        try {
            const data = await membersApi.getAll();
            setMembers(data);
        } catch (error) {
            toast.error("Erro ao carregar membros");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!memberToDelete) return;

        setIsDeleting(true);
        try {
            await membersApi.delete(memberToDelete.id);
            setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
            toast.success("Membro excluído com sucesso");
            setDeleteDialogOpen(false);
            setMemberToDelete(null);
        } catch (error) {
            toast.error("Erro ao excluir membro");
        } finally {
            setIsDeleting(false);
        }
    };

    const stats = {
        total: members.length,
        active: members.filter(m => m.status === "active").length,
        inactive: members.filter(m => m.status === "inactive").length,
        visitors: members.filter(m => m.status === "visitor").length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Membros</h2>
                    <p className="text-muted-foreground">Gerencie os membros da sua igreja</p>
                </div>
                <Link href="/members/new">
                    <Button className="bg-[#004E7F] hover:bg-[#003d63]">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Membro
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                        <Users className="h-4 w-4 text-[#004E7F]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
                        <UserX className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Visitantes</CardTitle>
                        <UserPlus className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.visitors}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Membros</CardTitle>
                    <CardDescription>
                        {filteredMembers.length} membro(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, email ou telefone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={statusFilter === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter("all")}
                                className={statusFilter === "all" ? "bg-[#004E7F]" : ""}
                            >
                                Todos
                            </Button>
                            <Button
                                variant={statusFilter === "active" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter("active")}
                                className={statusFilter === "active" ? "bg-green-600" : ""}
                            >
                                Ativos
                            </Button>
                            <Button
                                variant={statusFilter === "visitor" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter("visitor")}
                                className={statusFilter === "visitor" ? "bg-blue-600" : ""}
                            >
                                Visitantes
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-[#004E7F]" />
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-10">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="font-semibold mb-1">Nenhum membro encontrado</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {searchTerm || statusFilter !== "all"
                                    ? "Tente ajustar os filtros de busca"
                                    : "Comece adicionando o primeiro membro"}
                            </p>
                            {!searchTerm && statusFilter === "all" && (
                                <Link href="/members/new">
                                    <Button className="bg-[#004E7F] hover:bg-[#003d63]">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Adicionar Membro
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead className="hidden md:table-cell">Telefone</TableHead>
                                        <TableHead className="hidden lg:table-cell">Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{member.name}</p>
                                                    <p className="text-sm text-muted-foreground md:hidden">
                                                        {member.phone}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {member.phone}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                {member.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusConfig[member.status].color}>
                                                    {statusConfig[member.status].label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <Link href={`/members/${member.id}`}>
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Visualizar
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <Link href={`/members/${member.id}/edit`}>
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setMemberToDelete(member);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir o membro <strong>{memberToDelete?.name}</strong>?
                            Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                "Excluir"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
