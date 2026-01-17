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

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulação de login (será substituído por Supabase)
        setTimeout(() => {
            if (formData.email && formData.password) {
                toast.success("Login realizado com sucesso!");
                router.push("/dashboard");
            } else {
                toast.error("Preencha todos os campos");
            }
            setIsLoading(false);
        }, 1000);
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
                    <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
                    <CardDescription>Entre com suas credenciais para acessar o painel</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                                <Link href="/forgot-password" className="text-sm text-[#004E7F] hover:underline">
                                    Esqueceu a senha?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                    Entrando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                    </form>
                    <div className="mt-6 text-center text-sm">
                        <span className="text-muted-foreground">Não tem uma conta? </span>
                        <Link href="/register" className="text-[#004E7F] hover:underline font-medium">
                            Cadastre-se
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
