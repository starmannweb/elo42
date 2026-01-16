/**
 * WhatsApp Integration Module
 * 
 * Integração com a Evolution API para envio de mensagens via WhatsApp
 * @see https://doc.evolution-api.com
 */

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || "http://elo42-evolution-api.ao6xen.easypanel.host";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "429683C4C977415CAAFCCE10F7D57E11";
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || "elo42";

interface SendMessageOptions {
    to: string; // Número do WhatsApp (apenas números, ex: 5511999999999)
    message: string;
}

interface SendMediaOptions extends SendMessageOptions {
    mediaUrl: string;
    caption?: string;
    mediaType: "image" | "video" | "audio" | "document";
}

interface EvolutionResponse {
    key: {
        remoteJid: string;
        fromMe: boolean;
        id: string;
    };
    message: {
        extendedTextMessage?: {
            text: string;
        };
    };
    status: string;
}

/**
 * Formatar número de telefone para formato WhatsApp
 */
export function formatPhoneNumber(phone: string): string {
    // Remove tudo que não é número
    let cleaned = phone.replace(/\D/g, "");

    // Adiciona código do Brasil se necessário
    if (cleaned.length === 11) {
        cleaned = "55" + cleaned;
    } else if (cleaned.length === 10) {
        cleaned = "55" + cleaned;
    }

    return cleaned;
}

/**
 * Enviar mensagem de texto
 */
export async function sendTextMessage(options: SendMessageOptions): Promise<EvolutionResponse> {
    const { to, message } = options;
    const formattedNumber = formatPhoneNumber(to);

    const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": EVOLUTION_API_KEY
        },
        body: JSON.stringify({
            number: formattedNumber,
            text: message
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao enviar mensagem: ${response.status}`);
    }

    return response.json();
}

/**
 * Enviar mensagem com mídia
 */
export async function sendMediaMessage(options: SendMediaOptions): Promise<EvolutionResponse> {
    const { to, message, mediaUrl, caption, mediaType } = options;
    const formattedNumber = formatPhoneNumber(to);

    const response = await fetch(`${EVOLUTION_API_URL}/message/sendMedia/${INSTANCE_NAME}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": EVOLUTION_API_KEY
        },
        body: JSON.stringify({
            number: formattedNumber,
            mediatype: mediaType,
            media: mediaUrl,
            caption: caption || message
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao enviar mídia: ${response.status}`);
    }

    return response.json();
}

/**
 * Templates de mensagens para a igreja
 */
export const messageTemplates = {
    // Boas-vindas
    welcome: (name: string) =>
        `🙏 Olá, ${name}!\n\nSeja bem-vindo(a) à nossa igreja! Estamos muito felizes em tê-lo(a) conosco.\n\nQualquer dúvida, estamos à disposição.\n\n*Elo 42 - Conectando propósito e impacto*`,

    // Confirmação de evento
    eventConfirmation: (name: string, eventName: string, eventDate: string) =>
        `📅 Olá, ${name}!\n\nSua presença no evento *${eventName}* foi confirmada para o dia *${eventDate}*.\n\nAguardamos você!\n\n*Elo 42*`,

    // Lembrete de evento
    eventReminder: (name: string, eventName: string, eventDate: string) =>
        `⏰ Olá, ${name}!\n\nLembrete: O evento *${eventName}* acontece amanhã, *${eventDate}*.\n\nNão perca!\n\n*Elo 42*`,

    // Confirmação de pagamento
    paymentConfirmation: (name: string, amount: string, type: string) =>
        `✅ Olá, ${name}!\n\nRecebemos seu ${type} no valor de *${amount}*.\n\nMuito obrigado pela sua contribuição!\n\n*Elo 42*`,

    // Aniversário
    birthday: (name: string) =>
        `🎂 Feliz Aniversário, ${name}!\n\nQue Deus abençoe grandemente este novo ciclo da sua vida!\n\n*Elo 42*`,

    // Solicitação de oração
    prayerRequest: (name: string) =>
        `🙏 Olá, ${name}!\n\nRecebemos seu pedido de oração e nossa equipe pastoral está orando por você.\n\nDeus está no controle!\n\n*Elo 42*`
};

/**
 * Enviar notificação de boas-vindas
 */
export async function sendWelcomeMessage(phone: string, name: string): Promise<EvolutionResponse> {
    return sendTextMessage({
        to: phone,
        message: messageTemplates.welcome(name)
    });
}

/**
 * Enviar confirmação de evento
 */
export async function sendEventConfirmation(
    phone: string,
    name: string,
    eventName: string,
    eventDate: string
): Promise<EvolutionResponse> {
    return sendTextMessage({
        to: phone,
        message: messageTemplates.eventConfirmation(name, eventName, eventDate)
    });
}

/**
 * Enviar confirmação de pagamento
 */
export async function sendPaymentConfirmation(
    phone: string,
    name: string,
    amount: string,
    type: string
): Promise<EvolutionResponse> {
    return sendTextMessage({
        to: phone,
        message: messageTemplates.paymentConfirmation(name, amount, type)
    });
}

/**
 * Enviar mensagem em massa (broadcast)
 */
export async function sendBulkMessage(
    phones: string[],
    message: string,
    delayMs: number = 2000
): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const phone of phones) {
        try {
            await sendTextMessage({ to: phone, message });
            success.push(phone);
            // Delay para evitar bloqueio
            await new Promise(resolve => setTimeout(resolve, delayMs));
        } catch (error) {
            console.error(`Erro ao enviar para ${phone}:`, error);
            failed.push(phone);
        }
    }

    return { success, failed };
}
