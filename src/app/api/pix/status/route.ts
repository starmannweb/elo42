/**
 * API Route: Verificar Status do PIX
 * GET /api/pix/status?id=uuid
 * 
 * REGRA DE OURO #1: Sempre verificar paid_at (não confiar apenas no status)
 */

import { NextRequest, NextResponse } from "next/server";

const PAGOU_API_URL = "https://api.pagou.com.br";
const PAGOU_API_KEY = process.env.PAGOU_API_KEY || "c3d8fc87-cdf8-4ffc-8dce-66ecf7b6b66e";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pixId = searchParams.get("id");

        if (!pixId) {
            return NextResponse.json(
                { error: "ID do PIX não fornecido" },
                { status: 400 }
            );
        }

        // Consultar status via API Pagou
        const response = await fetch(`${PAGOU_API_URL}/v1/pix/${pixId}`, {
            method: "GET",
            headers: {
                "X-API-KEY": PAGOU_API_KEY,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Erro Pagou:", errorData);
            return NextResponse.json(
                { error: "Erro ao consultar status", details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();

        /**
         * Status Possíveis (conforme Gist):
         * 0 = Pendente
         * 1 = Processando (verificar paid_at!)
         * 2 = Expirado
         * 3 = Cancelado
         * 4 = Pago
         * 
         * IMPORTANTE: Sempre verificar paid_at para confirmar pagamento real
         */

        return NextResponse.json({
            id: data.id,
            status: data.status,
            paid_at: data.paid_at, // CRUCIAL: verificar se está preenchido
            expired_at: data.expired_at,
            amount: data.amount,
            is_paid: data.paid_at !== null && data.paid_at !== undefined
        });

    } catch (error) {
        console.error("Erro ao verificar status:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
