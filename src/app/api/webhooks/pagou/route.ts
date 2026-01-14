/**
 * Pagou Webhook Handler
 * 
 * Este endpoint recebe notificações de pagamento da API Pagou
 * Quando um PIX é pago, a Pagou envia uma requisição para este endpoint
 */

import { NextRequest, NextResponse } from "next/server";

interface PagouWebhookPayload {
    id: string;
    type: "pix.paid" | "pix.expired" | "pix.cancelled" | "charge.paid" | "charge.cancelled";
    data: {
        id: string;
        amount: number;
        status: number;
        paid_at: string | null;
        payer?: {
            name: string;
            document: string;
        };
        metadata?: Array<{ key: string; value: string }>;
    };
    created_at: string;
}

// Armazenar pagamentos em memória (em produção, usar banco de dados)
const payments: Map<string, PagouWebhookPayload> = new Map();

export async function POST(request: NextRequest) {
    try {
        // Verificar API Key (opcional, mas recomendado)
        const apiKey = request.headers.get("X-API-KEY");
        const expectedKey = process.env.PAGOU_WEBHOOK_SECRET;

        // Se houver uma chave configurada, validar
        if (expectedKey && apiKey !== expectedKey) {
            console.warn("Webhook: Chave de API inválida");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse do payload
        const payload: PagouWebhookPayload = await request.json();

        console.log("Webhook recebido:", JSON.stringify(payload, null, 2));

        // Processar o evento
        switch (payload.type) {
            case "pix.paid":
                // PIX foi pago - verificar paid_at para confirmar
                if (payload.data.paid_at) {
                    console.log(`✅ PIX ${payload.data.id} pago em ${payload.data.paid_at}`);
                    // Aqui você atualizaria o banco de dados
                    // await updatePaymentStatus(payload.data.id, "paid");

                    // Extrair metadata para saber qual membro/doação
                    const metadata = payload.data.metadata;
                    if (metadata) {
                        const memberId = metadata.find(m => m.key === "member_id")?.value;
                        const donationType = metadata.find(m => m.key === "type")?.value;
                        console.log(`Membro: ${memberId}, Tipo: ${donationType}`);
                    }
                }
                break;

            case "pix.expired":
                console.log(`⏰ PIX ${payload.data.id} expirado`);
                // await updatePaymentStatus(payload.data.id, "expired");
                break;

            case "pix.cancelled":
                console.log(`❌ PIX ${payload.data.id} cancelado`);
                // await updatePaymentStatus(payload.data.id, "cancelled");
                break;

            case "charge.paid":
                console.log(`✅ Boleto ${payload.data.id} pago`);
                break;

            case "charge.cancelled":
                console.log(`❌ Boleto ${payload.data.id} cancelado`);
                break;

            default:
                console.log(`Evento desconhecido: ${payload.type}`);
        }

        // Armazenar para consulta (temporário)
        payments.set(payload.data.id, payload);

        // Retornar sucesso
        return NextResponse.json(
            { success: true, message: "Webhook processado" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Erro ao processar webhook:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Endpoint GET para verificar status (para debug)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
        const payment = payments.get(id);
        if (payment) {
            return NextResponse.json(payment);
        }
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Retornar todos os pagamentos recebidos
    return NextResponse.json({
        message: "Pagou Webhook Endpoint",
        total: payments.size,
        payments: Array.from(payments.values())
    });
}
