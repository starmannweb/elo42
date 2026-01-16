/**
 * API Route: Criar PIX via Pagou
 * POST /api/pix/create
 */

import { NextRequest, NextResponse } from "next/server";

const PAGOU_API_URL = "https://api.pagou.com.br";
const PAGOU_API_KEY = process.env.PAGOU_API_KEY || "c3d8fc87-cdf8-4ffc-8dce-66ecf7b6b66e";

interface CreatePixRequest {
    amount: number;
    description?: string;
    metadata?: Array<{ key: string; value: string }>;
}

export async function POST(request: NextRequest) {
    try {
        const body: CreatePixRequest = await request.json();

        if (!body.amount || body.amount <= 0) {
            return NextResponse.json(
                { error: "Valor inválido" },
                { status: 400 }
            );
        }

        // Criar PIX via API Pagou
        const response = await fetch(`${PAGOU_API_URL}/v1/pix`, {
            method: "POST",
            headers: {
                "X-API-KEY": PAGOU_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount: body.amount,
                description: body.description || "Doação Elo 42",
                expiration: 1800, // 30 minutos
                metadata: body.metadata || []
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Erro Pagou:", errorData);
            return NextResponse.json(
                { error: "Erro ao criar PIX", details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();

        // REGRA DE OURO #3: Base64 precisa de prefixo
        if (data.qr_code_base64 && !data.qr_code_base64.startsWith("data:image")) {
            data.qr_code_base64 = `data:image/png;base64,${data.qr_code_base64}`;
        }

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error("Erro ao criar PIX:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
