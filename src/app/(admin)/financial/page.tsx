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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
    Plus,
    ArrowUpCircle,
    ArrowDownCircle,
    Loader2,
    MoreHorizontal,
    Edit,
    Trash2
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    category: string;
    description: string;
    amount: number;
    date: string;
    memberName?: string;
    createdAt: string;
}

const incomeCategories = [
    { id: "dizimo", name: "Dízimo", icon: "💰" },
    { id: "oferta", name: "Oferta", icon: "🎁" },
    { id: "campanha", name: "Campanha", icon: "📢" },
    { id: "doacao", name: "Doação", icon: "❤️" },
    { id: "outro_entrada", name: "Outros", icon: "📥" }
];

const expenseCategories = [
    { id: "aluguel", name: "Aluguel", icon: "🏠" },
    { id: "energia", name: "Energia", icon: "💡" },
    { id: "agua", name: "Água", icon: "💧" },
    { id: "manutencao", name: "Manutenção", icon: "🔧" },
    { id: "material", name: "Material", icon: "📦" },
    { id: "salario", name: "Salário", icon: "👤" },
    { id: "evento", name: "Eventos", icon: "🎉" },
    { id: "outro_saida", name: "Outros", icon: "📤" }
];

const mockTransactions: Transaction[] = [
    { id: "1", type: "income", category: "Dízimo", description: "Dízimos do culto de domingo", amount: 4500, date: "2026-01-12", memberName: "Diversos", createdAt: "2026-01-12T20:00:00Z" },
    { id: "2", type: "income", category: "Oferta", description: "Ofertas do culto de domingo", amount: 1200, date: "2026-01-12", createdAt: "2026-01-12T20:00:00Z" },
    { id: "3", type: "expense", category: "Energia", description: "Conta de luz de janeiro", amount: 850, date: "2026-01-10", createdAt: "2026-01-10T10:00:00Z" },
    { id: "4", type: "income", category: "Dízimo", description: "Dízimos do culto de quarta", amount: 2100, date: "2026-01-08", createdAt: "2026-01-08T22:00:00Z" },
    { id: "5", type: "expense", category: "Manutenção", description: "Conserto do ar-condicionado", amount: 1200, date: "2026-01-07", createdAt: "2026-01-07T14:00:00Z" },
    { id: "6", type: "income", category: "Campanha", description: "Campanha de missões", amount: 3200, date: "2026-01-05", createdAt: "2026-01-05T21:00:00Z" },
    { id: "7", type: "expense", category: "Material", description: "Material de limpeza", amount: 380, date: "2026-01-03", createdAt: "2026-01-03T09:00:00Z" },
    { id: "8", type: "expense", category: "Aluguel", description: "Aluguel de janeiro", amount: 3500, date: "2026-01-02", createdAt: "2026-01-02T08:00:00Z" }
];

export default function FinancialPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        type: "income" as "income" | "expense",
        category: "",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        memberName: ""
    });

    useEffect(() => {
        setTimeout(() => {
            setTransactions(mockTransactions);
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredTransactions = transactions.filter(t => {
        if (activeTab === "income") return t.type === "income";
        if (activeTab === "expense") return t.type === "expense";
        return true;
    });

    const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const handleOpenDialog = (type: "income" | "expense") => {
        setFormData({
            type,
            category: "",
            description: "",
            amount: "",
            date: new Date().toISOString().split("T")[0],
            memberName: ""
        });
        setDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category || !formData.amount) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            const newTransaction: Transaction = {
                id: String(Date.now()),
                type: formData.type,
                category: formData.category,
                description: formData.description,
                amount: parseFloat(formData.amount),
                date: formData.date,
                memberName: formData.memberName || undefined,
                createdAt: new Date().toISOString()
            };
            setTransactions(prev => [newTransaction, ...prev]);
            toast.success(`${formData.type === 'income' ? 'Receita' : 'Despesa'} registrada com sucesso!`);
            setDialogOpen(false);
            setIsSubmitting(false);
        }, 500);
    };

    const handleDelete = () => {
        if (!transactionToDelete) return;
        setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
        toast.success("Lançamento excluído");
        setDeleteDialogOpen(false);
        setTransactionToDelete(null);
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Financeiro</h2>
                    <p className="text-muted-foreground">Controle de receitas e despesas da igreja</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => handleOpenDialog("income")}
                    >
                        <ArrowUpCircle className="mr-2 h-4 w-4" />
                        Receita
                    </Button>
                    <Button
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                        onClick={() => handleOpenDialog("expense")}
                    >
                        <ArrowDownCircle className="mr-2 h-4 w-4" />
                        Despesa
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
                        <p className="text-xs text-muted-foreground">Este mês</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</div>
                        <p className="text-xs text-muted-foreground">Este mês</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
                        <Wallet className="h-4 w-4 text-violet-600" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(balance)}
                        </div>
                        <p className="text-xs text-muted-foreground">Resultado do mês</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lançamentos</CardTitle>
                    <CardDescription>Histórico de movimentações financeiras</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                        <TabsList>
                            <TabsTrigger value="all">Todos</TabsTrigger>
                            <TabsTrigger value="income">Receitas</TabsTrigger>
                            <TabsTrigger value="expense">Despesas</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center py-10">
                            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="font-semibold mb-1">Nenhum lançamento</h3>
                            <p className="text-sm text-muted-foreground">Registre a primeira movimentação</p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead className="hidden md:table-cell">Descrição</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>
                                                {transaction.type === 'income' ? (
                                                    <ArrowUpCircle className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <ArrowDownCircle className="h-5 w-5 text-red-600" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{transaction.category}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                                                {transaction.description || "-"}
                                            </TableCell>
                                            <TableCell>{formatDate(transaction.date)}</TableCell>
                                            <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setTransactionToDelete(transaction);
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* New Transaction Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {formData.type === 'income' ? (
                                <>
                                    <ArrowUpCircle className="h-5 w-5 text-green-600" />
                                    Nova Receita
                                </>
                            ) : (
                                <>
                                    <ArrowDownCircle className="h-5 w-5 text-red-600" />
                                    Nova Despesa
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Registre uma nova movimentação financeira
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                                        <SelectItem key={cat.id} value={cat.name}>
                                            {cat.icon} {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Valor (R$) *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0,00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Data *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                placeholder="Detalhes do lançamento..."
                                rows={2}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className={formData.type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="mr-2 h-4 w-4" />
                                )}
                                Registrar
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
                            Tem certeza que deseja excluir este lançamento de <strong>{formatCurrency(transactionToDelete?.amount || 0)}</strong>?
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
