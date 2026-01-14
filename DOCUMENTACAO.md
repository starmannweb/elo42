# Elo 42 - Documentação Completa

Sistema de Gestão para Igrejas - MVP

---

## 🔐 Credenciais de Acesso

> **ATENÇÃO**: No MVP atual, o sistema usa **dados simulados (mock)**. 
> Qualquer email/senha funciona para acessar o painel.

### Acesso Demo

| Campo | Valor |
|-------|-------|
| **URL** | http://localhost:3000/login |
| **E-mail** | `admin@igreja.com` |
| **Senha** | `123456` |

---

## 🔗 Links do Projeto

| Recurso | URL |
|---------|-----|
| **Repositório GitHub** | https://github.com/starmannweb/elo42 |
| **Servidor Local** | http://localhost:3000 |
| **Deploy Vercel** | *(Conectar repositório)* |

---

## 📱 Páginas Disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Landing page pública |
| `/login` | Página de login |
| `/register` | Página de cadastro |
| `/dashboard` | Painel principal |
| `/members` | Gestão de membros |
| `/members/new` | Novo membro |
| `/members/[id]` | Detalhes do membro |
| `/members/[id]/edit` | Editar membro |
| `/events` | Gestão de eventos |
| `/requests` | Solicitações (oração, batismo) |
| `/sermons` | Ministrações (áudio/vídeo) |
| `/financial` | Controle financeiro |
| `/settings` | Configurações da igreja |

---

## 🌙 Dark Mode

O sistema suporta **3 modos de tema**:
- ☀️ **Claro** - Tema light
- 🌙 **Escuro** - Tema dark
- 💻 **Sistema** - Segue o sistema operacional

Para alternar: clique no ícone de sol/lua no header do painel administrativo.

---

## 🛠️ Stack Técnica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 16.1.1 | Framework React |
| React | 19.2.3 | UI Library |
| TypeScript | 5.x | Tipagem |
| Tailwind CSS | 4.x | Estilos |
| shadcn/ui | Latest | Componentes |
| Lucide React | Latest | Ícones |
| next-themes | Latest | Dark mode |
| Zustand | Latest | Estado global |
| React Query | Latest | Cache/fetch |
| Supabase JS | Latest | Backend (pronto) |
| Recharts | Latest | Gráficos |
| Sonner | Latest | Toasts |

---

## 📂 Estrutura de Pastas

```
app/
├── src/
│   ├── app/
│   │   ├── (admin)/           # Páginas protegidas
│   │   │   ├── dashboard/
│   │   │   ├── members/
│   │   │   ├── events/
│   │   │   ├── requests/
│   │   │   ├── sermons/
│   │   │   ├── financial/
│   │   │   ├── settings/
│   │   │   └── layout.tsx     # Layout com sidebar
│   │   ├── (auth)/            # Páginas de auth
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Estilos globais
│   ├── components/
│   │   ├── ui/                # Componentes shadcn
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   ├── utils.ts           # Utilitários
│   │   └── mock-data.ts       # Dados de teste
│   └── types/
│       └── index.ts           # TypeScript types
├── public/
│   ├── manifest.json          # PWA config
│   └── icon.svg               # Ícone
└── package.json
```

---

## ▶️ Como Executar

### Desenvolvimento

```bash
# Entrar na pasta do projeto
cd "c:\Users\Ricieri\Desktop\Projetos\Elo 42\app"

# Instalar dependências (se necessário)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

### Produção

```bash
# Build
npm run build

# Iniciar em produção
npm start
```

---

## 🚀 Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em **"Add New" → "Project"**
4. Selecione o repositório `starmannweb/elo42`
5. Clique em **"Deploy"**
6. Aguarde ~2 minutos

**Pronto!** Sua URL será gerada automaticamente.

---

## 📌 Próximos Passos

### Fase 1: Supabase
- [ ] Criar projeto em supabase.com
- [ ] Configurar variáveis de ambiente
- [ ] Criar tabelas no banco
- [ ] Integrar autenticação real

### Fase 2: Funcionalidades
- [ ] Upload de imagens
- [ ] Relatórios em PDF
- [ ] Notificações push
- [ ] Integração WhatsApp

### Fase 3: PWA
- [ ] Service Worker
- [ ] Modo offline
- [ ] Instalação

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| Páginas | 14 |
| Componentes | 18+ |
| Linhas de código | ~15.000 |
| Arquivos | 55+ |

---

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato com o desenvolvedor.

---

*Documentação gerada em 14/01/2026*
