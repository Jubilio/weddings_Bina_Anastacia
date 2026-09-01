# Convite de Casamento — Bina & Anastácia 💍

Website responsivo e elegante para convite de casamento, desenvolvido com as tecnologias mais modernas. Apresenta uma experiência visual refinada, confirmação de presença integrada e gestão completa de convidados.

## ✨ Funcionalidades Principais

- 🏠 **Página inicial** com apresentação personalizada dos noivos
- 📝 **Formulário RSVP** inteligente com confirmação de presença e registo de convidados
- 🎁 **Galeria de presentes** com formas de contribuição
- 📍 **Localização e detalhes** da cerimónia e almoço
- 🎵 **Música de fundo** opcional e personalizável
- 💾 **Gestão persistente** de convites com Cloudflare D1
- 🔗 **Links personalizados** para convidados específicos (nomes únicos)
- 🔐 **Painel admin** protegido com controlo de estado (pendente, confirmado, não comparece)
- 📱 **Design responsivo** otimizado para mobile, tablet e desktop
- 💌 **Mensagens aleatórias** personalizadas e emocionantes

## 🛠️ Tech Stack

| Tecnologia | Versão | Propósito |
|----------|--------|---------|
| **Next.js** | 16.2.6 | Framework React com SSR |
| **React** | 19.2.6 | UI e componentes |
| **TypeScript** | Latest | Type safety |
| **Vite** | Latest | Build rápido e dev server |
| **Tailwind CSS** | 4.x | Estilo e design system |
| **Drizzle ORM** | 0.45.2 | ORM para D1 |
| **Cloudflare D1** | - | Banco de dados SQLite serverless |
| **Cloudflare Workers** | - | Serverless compute |
| **shadcn-style UI** | - | Componentes acessíveis |

## 📋 Requisitos

- **Node.js**: 22.13 ou superior
- **npm**: 9.x ou superior
- **Cloudflare Account**: Com acesso a Workers e D1
- **Git**: Para versionamento

## 🚀 Começar

### 1. Instalação

```bash
# Clonar repositório
git clone <repository-url>
cd convite-casamento

# Instalar dependências
npm install

# Ou com script CI
npm run install:ci
```

### 2. Desenvolvimento

```bash
npm run dev
```

A aplicação fica disponível em **http://localhost:5173**

### 3. Build para Produção

```bash
npm run build
```

Gera output otimizado em `dist/`

### 4. Deploy no Cloudflare

```bash
npm run deploy:cloudflare
```

Aplica migrações D1 e faz deploy dos Workers

## 📁 Estrutura do Projeto

```
app/
├── page.tsx                 # Página principal do convite
├── presentes/page.tsx       # Página de presentes
├── admin/page.tsx           # Painel admin (protegido)
└── api/
    ├── admin/
    │   ├── invitations/route.ts   # API de convites
    │   ├── login/route.ts         # Autenticação
    │   └── logout/route.ts        # Logout
    └── rsvp/route.ts        # API de RSVP

components/
├── rsvp-form.tsx            # Formulário de confirmação
├── guest-admin.tsx          # Interface de gestão de convidados
├── random-love-message.tsx  # Mensagens personalizadas
├── music-player.tsx         # Controlo de música
└── ui/                      # Componentes reutilizáveis

db/
├── schema.ts                # Schema do D1
└── index.ts                 # Configuração do ORM

build/
└── sites-vite-plugin.ts     # Plugin Vite customizado

scripts/
├── build-verified.sh        # Build com validações
├── install-ci.sh            # Instalação CI/CD
└── sites-env.sh             # Setup de variáveis

public/                       # Arquivos estáticos
tests/                        # Testes automatizados
```

## ⚙️ Configuração

### Dados do Evento

Os dados principais estão em [app/page.tsx](app/page.tsx):

```typescript
const invitation = {
  noivos: { nome1: "...", nome2: "..." },
  data: "...",
  hora: "...",
  local: {
    cerimonia: "...",
    almoco: "..."
  },
  whatsapp: "+55...",
  googleMaps: "..."
};
```

**Campos a personalizar:**
- ✏️ Nomes dos noivos
- 📅 Data, hora e local do evento
- 👨‍👩‍👧‍👦 Família e relação com convidados
- 📱 Número WhatsApp para confirmações
- 🗺️ Link Google Maps do local

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz:

```env
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...

# D1
D1_DATABASE_ID=casamento-bina-anastacia-db

# Autenticação Admin
ADMIN_PASSWORD=seu_password_seguro

# Opcional
ENABLE_MUSIC=true
```

## 💾 Base de Dados

### Configuração D1

O projeto usa **Cloudflare D1** (SQLite serverless):

- **Binding**: `DB`
- **Database**: `casamento-bina-anastacia-db`
- **ORM**: Drizzle

### Schema de Convidados

Definido em [db/schema.ts](db/schema.ts):

```typescript
export const guests = sqliteTable("guests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status"), // "pending" | "confirmed" | "declined"
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
  // ... campos adicionais
});
```

### Gerenciar Migrações

```bash
# Gerar nova migração
npm run db:generate

# Aplicar migrações localmente
wrangler d1 migrations list

# Aplicar remotamente
wrangler d1 migrations apply casamento-bina-anastacia-db --remote
```

## 🔐 Painel Admin

Acesso protegido em `/admin`:

- Visualizar todas as confirmações
- Filtrar por estado (pendente, confirmado, não comparece)
- Editar status manualmente
- Exportar lista de convidados
- Estatísticas em tempo real

**Autenticação**: Password configurável em variáveis de ambiente

## 🧪 Testes

```bash
# Executar testes
npm run test

# Build + testes
npm run build && npm run test
```

## 📝 Lint & Formatação

```bash
npm run lint
```

## 🌐 Deploy

### Cloudflare Workers

Pipeline automatizado com estes passos:

1. **Build**: `npm run build`
2. **Migrações**: Aplicar D1 migrations
3. **Deploy**: Enviar Worker e assets

```bash
npm run deploy:cloudflare
```

### Verificações Pre-Deploy

- Build validado (`build-verified.sh`)
- Variáveis de ambiente configuradas
- D1 migrations aplicadas
- RBAC e permissões Cloudflare

## 📦 Componentes Principais

| Componente | Localização | Descrição |
|-----------|-----------|-----------|
| **RSVP Form** | [components/rsvp-form.tsx](components/rsvp-form.tsx) | Formulário de confirmação com validação |
| **Guest Admin** | [components/guest-admin.tsx](components/guest-admin.tsx) | Painel de gestão de convidados |
| **Love Message** | [components/random-love-message.tsx](components/random-love-message.tsx) | Mensagens aleatórias personalizadas |
| **Music Player** | [components/music-player.tsx](components/music-player.tsx) | Controlo de música de fundo |
| **UI Library** | [components/ui/](components/ui/) | Componentes reutilizáveis (50+) |

## 🎨 Customização Visual

### Temas

Suporte a temas via `next-themes`:

```bash
npm run dev -- --theme=dark
```

### Cores e Tipografia

Tailwind CSS com configuração em `tailwind.config.ts`

### Responsividade

Breakpoints padrão Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🐛 Troubleshooting

### "Cannot find module 'wrangler'"
```bash
npm install -g @cloudflare/wrangler
```

### D1 connection failed
```bash
# Verificar configuração
cat wrangler.toml

# Testar ligação
wrangler d1 execute casamento-bina-anastacia-db --command "SELECT 1"
```

### Build fails
```bash
# Limpar cache
rm -rf .next dist node_modules/.cache
npm run build
```

## 📚 Documentação Adicional

- [Next.js Docs](https://nextjs.org/docs)
- [Cloudflare Workers](https://workers.cloudflare.com/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)

## 📄 Licença

Projeto privado para evento pessoal.

## 💬 Suporte

Para dúvidas ou problemas, contacte os desenvolvedores ou crie uma issue no repositório.

---

**Última atualização**: 2026-01-09

O comando de deploy aplica primeiro as migrações pendentes ao D1 e só depois
publica o Worker. Configure também um segredo de execução chamado
`ADMIN_PASSWORD`; ele protege o painel `/admin` e não deve ser guardado no
repositório.

## Personalização final antes de partilhar

Antes de enviar o convite para os convidados, recomenda-se confirmar:

- texto da data e hora;
- descrição do local;
- endereço completo ou link de mapa;
- número de WhatsApp final;
- lista de presentes e valores/contribuições;
- texto final da mensagem principal do convite.

## Observações

- O formulário de confirmação está preparado para integração com WhatsApp e base de dados do projecto.
- O tema visual foi desenhado para ser elegante, discreto e adequado a um convite de casamento.
- Para alterações visuais mais profundas, os estilos principais encontram-se em [app/globals.css](app/globals.css).

## Comandos úteis

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
```
