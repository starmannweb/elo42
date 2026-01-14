/**
 * Pagou API Client - Elo 42
 * @see https://docs.pagou.com.br/
 * @see https://gist.github.com/dantetesta/8d96db8e81708d129765a8a45988c7f0
 * 
 * REGRAS DE OURO:
 * 1. Sempre verificar paid_at (não confiar apenas no status)
 * 2. Polling a cada 5 segundos para verificar pagamento
 * 3. Base64 precisa do prefixo data:image/png;base64,
 */

// Usar produção (token real fornecido)
const BASE_URL = "https://api.pagou.com.br";

// Token real do cliente
const API_KEY = process.env.PAGOU_API_KEY || "c3d8fc87-cdf8-4ffc-8dce-66ecf7b6b66e";

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
    document: string; // CPF (11 dígitos) ou CNPJ
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
    amount: number; // Valor em reais (ex: 5.00)
    description: string;
    expiration?: number; // Tempo em segundos para expirar (default: 3600 = 1 hora)
    payer: PagouPayer; // CPF e nome são obrigatórios
    customer_code?: string;
    notification_url?: string;
    metadata?: PagouMetadata[];
}

export interface CreateBoletoRequest {
    amount: number;
    description: string;
    due_date: string; // YYYY-MM-DD
    payer: PagouPayerBoleto;
    customer_code?: string;
    notification_url?: string;
    fine?: number;
    interest?: number;
    grace_period?: number;
    discount?: {
        type: "fixed" | "percent";
        amount: number;
        limit_date: string;
    };
    metadata?: PagouMetadata[];
}

export interface PixResponse {
    id: string;
    amount: number;
    description: string;
    expiration: number;
    payer: PagouPayer;
    payload: {
        data: string; // Código PIX copia e cola
        image: string; // QR Code em base64 (SEM prefixo data:image/png;base64,)
    };
    status: 0 | 1 | 2 | 3 | 4; // 0=Pendente, 1=Pago, 2=Cancelado, 3=Expirado, 4=Reembolsado
    paid_at: string | null; // ⚠️ IMPORTANTE: Só confirmar pagamento se paid_at tiver valor!
    expired_at?: string;
    created_at: string;
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
 * 
 * @example
 * const pix = await createPixQRCode({
 *   amount: 100.00,
 *   description: "Dízimo Janeiro",
 *   expiration: 3600, // 1 hora
 *   payer: { name: "João Silva", document: "12345678909" }
 * });
 */
export async function createPixQRCode(data: CreatePixRequest): Promise<PixResponse> {
    const response = await fetch(`${BASE_URL}/v1/pix`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            ...data,
            expiration: data.expiration || 3600 // Default 1 hora
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao criar PIX: ${response.status}`);
    }

    return response.json();
}

/**
 * Consultar um QR Code PIX
 * 
 * ⚠️ IMPORTANTE: Verificar paid_at, não apenas status!
 * A API pode retornar status=1 sem paid_at em modo teste.
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
 * Verificar se o PIX foi realmente pago
 * 
 * Retorna true APENAS se paid_at tiver um valor
 * (não confia apenas no status)
 */
export async function isPaid(qrcodeId: string): Promise<boolean> {
    const data = await getPixQRCode(qrcodeId);
    // ✅ VALIDAÇÃO CORRETA: Só confirma se paid_at existir e não for null
    return data.paid_at !== null && data.paid_at !== undefined && data.paid_at !== "";
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
 * Formatar valor em BRL
 */
export function formatBRL(value: number): string {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/**
 * Formatar base64 do QR Code para exibição em <img>
 * A API retorna base64 sem prefixo, precisamos adicionar
 */
export function formatQRCodeImage(base64: string): string {
    // Se já tem o prefixo, retorna como está
    if (base64.startsWith("data:image")) {
        return base64;
    }
    // Adiciona o prefixo necessário
    return `data:image/png;base64,${base64}`;
}

/**
 * Limpar CPF (remover pontos e traços)
 */
export function cleanCPF(cpf: string): string {
    return cpf.replace(/\D/g, "");
}

/**
 * Validar CPF (verifica se tem 11 dígitos)
 */
export function isValidCPF(cpf: string): boolean {
    const cleaned = cleanCPF(cpf);
    return cleaned.length === 11;
}
