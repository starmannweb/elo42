"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WifiOff, Home, RefreshCw } from "lucide-react";

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#004E7F] to-[#003050] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-[#004E7F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <WifiOff className="h-10 w-10 text-[#004E7F]" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Você está offline
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Parece que você está sem conexão com a internet. Verifique sua conexão e tente novamente.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Tentar Novamente
                    </Button>
                    <Link href="/dashboard">
                        <Button className="w-full bg-[#004E7F] hover:bg-[#003d63] gap-2">
                            <Home className="h-4 w-4" />
                            Ir para Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold text-[#D4A84B]">Elo 42</span> - Sistema de Gestão para Igrejas
                    </p>
                </div>
            </div>
        </div>
    );
}
