"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        churchName: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("As senhas não conferem");
            return;
        }

        setIsLoading(true);

        // Simulação de registro (será substituído por Supabase)
        setTimeout(() => {
            toast.success("Conta criada com sucesso!");
            router.push("/dashboard");
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004E7F]/5 via-white to-[#004E7F]/5 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
            <Card className="w-full max-w-md border-0 shadow-2xl">
                <CardHeader className="text-center pb-2">
                    <Link href="/" className="inline-flex items-center justify-center mb-4">
                        <Image
                            src="/logo.png"
                            alt="Elo 42"
                            width={180}
                            height={60}
                            className="h-auto"
                        />
                    </Link>
                    <CardTitle className="text-2xl">Criar conta</CardTitle>
                    <CardDescription>Comece a gerenciar sua igreja gratuitamente</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="churchName">Nome da Igreja</Label>
                            <Input
                                id="churchName"
                                placeholder="Igreja Exemplo"
                                value={formData.churchName}
                                onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Seu Nome</Label>
                            <Input
                                id="name"
                                placeholder="Seu nome completo"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirme sua senha"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#004E7F] hover:bg-[#003d63]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando conta...
                                </>
                            ) : (
                                "Criar Conta Grátis"
                            )}
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Já tem uma conta? </span>
                        <Link href="/login" className="text-[#004E7F] hover:underline font-medium">
                            Entrar
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
