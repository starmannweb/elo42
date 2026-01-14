import { Member } from "@/types";

// Mock data for development - will be replaced by Supabase
export const mockMembers: Member[] = [
    {
        id: "1",
        name: "Maria Silva Santos",
        email: "maria.silva@email.com",
        phone: "(11) 99999-1111",
        birthDate: "1985-03-15",
        address: "Rua das Flores, 123 - Centro",
        status: "active",
        baptismDate: "2020-06-20",
        notes: "Líder do ministério de louvor",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
    },
    {
        id: "2",
        name: "João Pedro Costa",
        email: "joao.pedro@email.com",
        phone: "(11) 99999-2222",
        birthDate: "1990-07-22",
        address: "Av. Principal, 456 - Vila Nova",
        status: "active",
        baptismDate: "2019-12-15",
        createdAt: "2024-01-10T14:30:00Z",
        updatedAt: "2024-01-10T14:30:00Z"
    },
    {
        id: "3",
        name: "Ana Paula Oliveira",
        email: "ana.oliveira@email.com",
        phone: "(11) 99999-3333",
        birthDate: "1978-11-08",
        address: "Rua São José, 789 - Jardim",
        status: "active",
        notes: "Coordenadora das células",
        createdAt: "2024-01-05T09:00:00Z",
        updatedAt: "2024-01-05T09:00:00Z"
    },
    {
        id: "4",
        name: "Carlos Eduardo Lima",
        email: "carlos.lima@email.com",
        phone: "(11) 99999-4444",
        birthDate: "1995-02-28",
        address: "Rua Nova, 321 - Centro",
        status: "visitor",
        createdAt: "2024-01-20T16:45:00Z",
        updatedAt: "2024-01-20T16:45:00Z"
    },
    {
        id: "5",
        name: "Patricia Ferreira",
        email: "patricia.f@email.com",
        phone: "(11) 99999-5555",
        birthDate: "1982-09-10",
        address: "Av. Brasil, 555 - Industrial",
        status: "inactive",
        baptismDate: "2018-04-08",
        notes: "Mudou de cidade",
        createdAt: "2023-06-12T11:20:00Z",
        updatedAt: "2024-01-02T08:00:00Z"
    },
    {
        id: "6",
        name: "Roberto Almeida",
        email: "roberto.a@email.com",
        phone: "(11) 99999-6666",
        birthDate: "1970-12-25",
        address: "Rua da Paz, 100 - Boa Vista",
        status: "active",
        baptismDate: "2015-01-10",
        notes: "Diácono",
        createdAt: "2023-01-01T10:00:00Z",
        updatedAt: "2023-01-01T10:00:00Z"
    },
    {
        id: "7",
        name: "Fernanda Rodrigues",
        email: "fernanda.r@email.com",
        phone: "(11) 99999-7777",
        birthDate: "1998-05-18",
        address: "Rua das Palmeiras, 222 - Centro",
        status: "active",
        createdAt: "2024-01-18T13:00:00Z",
        updatedAt: "2024-01-18T13:00:00Z"
    },
    {
        id: "8",
        name: "Lucas Mendes",
        email: "lucas.m@email.com",
        phone: "(11) 99999-8888",
        birthDate: "2000-08-30",
        address: "Av. Central, 888 - Novo Horizonte",
        status: "visitor",
        createdAt: "2024-01-22T15:30:00Z",
        updatedAt: "2024-01-22T15:30:00Z"
    }
];

// Helper to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const membersApi = {
    getAll: async (): Promise<Member[]> => {
        await delay(500);
        return mockMembers;
    },

    getById: async (id: string): Promise<Member | undefined> => {
        await delay(300);
        return mockMembers.find(m => m.id === id);
    },

    create: async (data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member> => {
        await delay(500);
        const newMember: Member = {
            ...data,
            id: String(Date.now()),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockMembers.push(newMember);
        return newMember;
    },

    update: async (id: string, data: Partial<Member>): Promise<Member | undefined> => {
        await delay(500);
        const index = mockMembers.findIndex(m => m.id === id);
        if (index === -1) return undefined;
        mockMembers[index] = {
            ...mockMembers[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        return mockMembers[index];
    },

    delete: async (id: string): Promise<boolean> => {
        await delay(300);
        const index = mockMembers.findIndex(m => m.id === id);
        if (index === -1) return false;
        mockMembers.splice(index, 1);
        return true;
    }
};
