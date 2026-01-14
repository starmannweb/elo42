/**
 * Pagou API Client
 * @see https://docs.pagou.com.br/
 */

const PAGOU_SANDBOX_URL = "https://sandbox-api.pagou.com.br";
const PAGOU_PRODUCTION_URL = "https://api.pagou.com.br";

// Use sandbox por padrão, mude para produção quando tiver a API Key real
const BASE_URL = process.env.NEXT_PUBLIC_PAGOU_ENV === "production"
    ? PAGOU_PRODUCTION_URL
    : PAGOU_SANDBOX_URL;

const API_KEY = process.env.PAGOU_API_KEY || "";

function getHeaders(): Record<string, string> {
    return {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
        "User-Agent": "Elo42/1.0"
    };
}

// ============ TIPOS ============

export interface PagouPayer {
    name: string;
    document: string; // CPF ou CNPJ
}

export interface PagouPayerBoleto extends PagouPayer {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
}

export interface PagouMetadata {
    key: string;
    value: string;
}

export interface CreatePixRequest {
    amount: number; // Valor em centavos
    description: string;
    expiration?: number; // Tempo em segundos para expirar
    payer?: PagouPayer;
    customer_code?: string;
    notification_url?: string;
    metadata?: PagouMetadata[];
}

export interface CreateBoletoRequest {
    amount: number; // Valor em centavos
    description: string;
    due_date: string; // YYYY-MM-DD
    payer: PagouPayerBoleto;
    customer_code?: string;
    notification_url?: string;
    fine?: number; // Multa em %
    interest?: number; // Juros em %
    grace_period?: number; // Dias de carência
    discount?: {
        type: "fixed" | "percent";
        amount: number;
        limit_date: string;
    };
    metadata?: PagouMetadata[];
}

export interface PixResponse {
    id: string;
    qrcode: string; // QR Code em formato texto (copia e cola)
    qrcode_image?: string; // Base64 da imagem do QR Code
    amount: number;
    status: "pending" | "paid" | "cancelled" | "expired";
    created_at: string;
    expires_at?: string;
}

export interface BoletoResponse {
    id: string;
    barcode: string;
    pdf_url?: string;
    amount: number;
    status: "pending" | "paid" | "cancelled" | "overdue";
    due_date: string;
    created_at: string;
}

export interface PagouError {
    error: string;
    message: string;
    statusCode: number;
}

// ============ FUNÇÕES DA API ============

/**
 * Criar um QR Code PIX
 */
export async function createPixQRCode(data: CreatePixRequest): Promise<PixResponse> {
    const response = await fetch(`${BASE_URL}/v1/pix`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao criar PIX: ${response.status}`);
    }

    return response.json();
}

/**
 * Consultar um QR Code PIX
 */
export async function getPixQRCode(qrcodeId: string): Promise<PixResponse> {
    const response = await fetch(`${BASE_URL}/v1/pix/${qrcodeId}`, {
        method: "GET",
        headers: getHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao consultar PIX: ${response.status}`);
    }

    return response.json();
}

/**
 * Cancelar um QR Code PIX
 */
export async function cancelPixQRCode(qrcodeId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/v1/pix/${qrcodeId}`, {
        method: "DELETE",
        headers: getHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao cancelar PIX: ${response.status}`);
    }
}

/**
 * Solicitar reembolso de um PIX
 */
export async function refundPixQRCode(
    qrcodeId: string,
    data: { amount: number; description: string; reason: number }
): Promise<void> {
    const response = await fetch(`${BASE_URL}/v1/pix/${qrcodeId}/refund`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao reembolsar PIX: ${response.status}`);
    }
}

/**
 * Criar um Boleto
 */
export async function createBoleto(data: CreateBoletoRequest): Promise<BoletoResponse> {
    const response = await fetch(`${BASE_URL}/v1/charges`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao criar Boleto: ${response.status}`);
    }

    return response.json();
}

/**
 * Consultar um Boleto
 */
export async function getBoleto(chargeId: string): Promise<BoletoResponse> {
    const response = await fetch(`${BASE_URL}/v1/charges/${chargeId}`, {
        method: "GET",
        headers: getHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao consultar Boleto: ${response.status}`);
    }

    return response.json();
}

/**
 * Cancelar um Boleto
 */
export async function cancelBoleto(chargeId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/v1/charges/${chargeId}`, {
        method: "DELETE",
        headers: getHeaders()
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao cancelar Boleto: ${response.status}`);
    }
}

// ============ UTILITÁRIOS ============

/**
 * Converter valor em reais para centavos
 */
export function toCents(value: number): number {
    return Math.round(value * 100);
}

/**
 * Converter centavos para reais
 */
export function toReal(cents: number): number {
    return cents / 100;
}

/**
 * Formatar valor em BRL
 */
export function formatBRL(cents: number): string {
    return toReal(cents).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
