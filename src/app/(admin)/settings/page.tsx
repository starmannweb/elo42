"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Church,
    Mail,
    Phone,
    Palette,
    Globe,
    Instagram,
    Facebook,
    Youtube,
    Save,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [churchData, setChurchData] = useState({
        name: "Igreja Exemplo",
        slogan: "Transformando vidas pelo amor de Cristo",
        description: "Somos uma igreja comprometida com o evangelho, a comunhão fraterna e o serviço ao próximo.",
        email: "contato@igrejaexemplo.com.br",
        phone: "(11) 99999-0000",
        address: "Rua das Flores, 123 - Centro, São Paulo - SP"
    });

    const [socialLinks, setSocialLinks] = useState({
        instagram: "https://instagram.com/igrejaexemplo",
        facebook: "https://facebook.com/igrejaexemplo",
        youtube: "https://youtube.com/@igrejaexemplo",
        whatsapp: "5511999990000"
    });

    const [themeColors, setThemeColors] = useState({
        primary: "#7c3aed",
        secondary: "#4f46e5",
        accent: "#eab308"
    });

    const handleSaveChurch = async () => {
        setIsLoading(true);
        setTimeout(() => {
            toast.success("Dados da igreja salvos com sucesso!");
            setIsLoading(false);
        }, 1000);
    };

    const handleSaveSocial = async () => {
        setIsLoading(true);
        setTimeout(() => {
            toast.success("Redes sociais atualizadas!");
            setIsLoading(false);
        }, 1000);
    };

    const handleSaveTheme = async () => {
        setIsLoading(true);
        setTimeout(() => {
            toast.success("Tema atualizado!");
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
                <p className="text-muted-foreground">Personalize as informações da sua igreja</p>
            </div>

            <Tabs defaultValue="church" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="church">
                        <Church className="h-4 w-4 mr-2" />
                        Igreja
                    </TabsTrigger>
                    <TabsTrigger value="social">
                        <Globe className="h-4 w-4 mr-2" />
                        Redes Sociais
                    </TabsTrigger>
                    <TabsTrigger value="theme">
                        <Palette className="h-4 w-4 mr-2" />
                        Aparência
                    </TabsTrigger>
                </TabsList>

                {/* Church Info Tab */}
                <TabsContent value="church">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações da Igreja</CardTitle>
                            <CardDescription>
                                Dados básicos que aparecerão no sistema e aplicativo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="churchName">Nome da Igreja</Label>
                                    <Input
                                        id="churchName"
                                        value={churchData.name}
                                        onChange={(e) => setChurchData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slogan">Slogan</Label>
                                    <Input
                                        id="slogan"
                                        value={churchData.slogan}
                                        onChange={(e) => setChurchData(prev => ({ ...prev, slogan: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                    id="description"
                                    rows={3}
                                    value={churchData.description}
                                    onChange={(e) => setChurchData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail de Contato</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="pl-9"
                                            value={churchData.email}
                                            onChange={(e) => setChurchData(prev => ({ ...prev, email: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            className="pl-9"
                                            value={churchData.phone}
                                            onChange={(e) => setChurchData(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Endereço</Label>
                                <Input
                                    id="address"
                                    value={churchData.address}
                                    onChange={(e) => setChurchData(prev => ({ ...prev, address: e.target.value }))}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    className="bg-[#004E7F] hover:bg-[#003d63]"
                                    onClick={handleSaveChurch}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Salvar Alterações
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Media Tab */}
                <TabsContent value="social">
                    <Card>
                        <CardHeader>
                            <CardTitle>Redes Sociais</CardTitle>
                            <CardDescription>
                                Links para as redes sociais da igreja
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <div className="relative">
                                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="instagram"
                                            className="pl-9"
                                            placeholder="https://instagram.com/..."
                                            value={socialLinks.instagram}
                                            onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="facebook">Facebook</Label>
                                    <div className="relative">
                                        <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="facebook"
                                            className="pl-9"
                                            placeholder="https://facebook.com/..."
                                            value={socialLinks.facebook}
                                            onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="youtube">YouTube</Label>
                                    <div className="relative">
                                        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="youtube"
                                            className="pl-9"
                                            placeholder="https://youtube.com/@..."
                                            value={socialLinks.youtube}
                                            onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">WhatsApp (só números)</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="whatsapp"
                                            className="pl-9"
                                            placeholder="5511999999999"
                                            value={socialLinks.whatsapp}
                                            onChange={(e) => setSocialLinks(prev => ({ ...prev, whatsapp: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    className="bg-[#004E7F] hover:bg-[#003d63]"
                                    onClick={handleSaveSocial}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Salvar Alterações
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Theme Tab */}
                <TabsContent value="theme">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aparência</CardTitle>
                            <CardDescription>
                                Personalize as cores do sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="primaryColor">Cor Primária</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="primaryColor"
                                            type="color"
                                            className="w-12 h-10 p-1 cursor-pointer"
                                            value={themeColors.primary}
                                            onChange={(e) => setThemeColors(prev => ({ ...prev, primary: e.target.value }))}
                                        />
                                        <Input
                                            value={themeColors.primary}
                                            onChange={(e) => setThemeColors(prev => ({ ...prev, primary: e.target.value }))}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="secondaryColor"
                                            type="color"
                                            className="w-12 h-10 p-1 cursor-pointer"
                                            value={themeColors.secondary}
                                            onChange={(e) => setThemeColors(prev => ({ ...prev, secondary: e.target.value }))}
                                        />
                                        <Input
                                            value={themeColors.secondary}
                                            onChange={(e) => setThemeColors(prev => ({ ...prev, secondary: e.target.value }))}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accentColor">Cor de Destaque</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="accentColor"
                                            type="color"
                                            className="w-12 h-10 p-1 cursor-pointer"
                                            value={themeColors.accent}
                                            onChange={(e) => setThemeColors(prev => ({ ...prev, accent: e.target.value }))}
                                        />
                                        <Input
                                            value={themeColors.accent}
                                            onChange={(e) => setThemeColors(prev => ({ ...prev, accent: e.target.value }))}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="p-6 rounded-lg border bg-gray-50 dark:bg-gray-900">
                                <p className="text-sm text-muted-foreground mb-4">Pré-visualização:</p>
                                <div className="flex gap-4 flex-wrap">
                                    <Button style={{ backgroundColor: themeColors.primary }}>
                                        Botão Primário
                                    </Button>
                                    <Button style={{ backgroundColor: themeColors.secondary }}>
                                        Botão Secundário
                                    </Button>
                                    <Button variant="outline" style={{ borderColor: themeColors.accent, color: themeColors.accent }}>
                                        Botão Destaque
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    className="bg-[#004E7F] hover:bg-[#003d63]"
                                    onClick={handleSaveTheme}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Salvar Alterações
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
