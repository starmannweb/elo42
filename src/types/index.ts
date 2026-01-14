// Types for the Elo 42 application

export interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    address: string;
    status: 'active' | 'inactive' | 'visitor';
    baptismDate?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    maxCapacity: number;
    active: boolean;
    createdBy: string;
    createdAt: string;
}

export interface ChurchRequest {
    id: string;
    memberId?: string;
    memberName: string;
    type: 'prayer' | 'baptism' | 'visit' | 'counseling' | 'other';
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    responseNotes?: string;
    handledBy?: string;
    createdAt: string;
    completedAt?: string;
}

export interface Sermon {
    id: string;
    title: string;
    description: string;
    preacher: string;
    mediaUrl: string;
    mediaType: 'audio' | 'video' | 'youtube';
    sermonDate: string;
    durationSeconds?: number;
    thumbnailUrl?: string;
    createdBy: string;
    createdAt: string;
}

export interface FinancialTransaction {
    id: string;
    accountId: string;
    categoryId: string;
    memberId?: string;
    memberName?: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    transactionDate: string;
    notes?: string;
    createdBy: string;
    createdAt: string;
}

export interface FinancialAccount {
    id: string;
    name: string;
    type: 'bank' | 'cash' | 'digital';
    balance: number;
    description?: string;
    active: boolean;
    createdAt: string;
}

export interface FinancialCategory {
    id: string;
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;
    active: boolean;
    createdAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'leader' | 'member';
    avatarUrl?: string;
    createdAt: string;
}

export interface ChurchSettings {
    id: string;
    churchName: string;
    slogan?: string;
    description?: string;
    logoUrl?: string;
    faviconUrl?: string;
    themeColors?: {
        primary: string;
        secondary: string;
        accent: string;
    };
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        youtube?: string;
        whatsapp?: string;
    };
    contactEmail?: string;
    contactPhone?: string;
}
