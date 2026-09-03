# Convite de Casamento — Bina & Anastácia 💍

Convite digital responsivo para o casamento de Anastácia e Bina, com confirmação de presença, convites personalizados, lista de presentes e gestão dos convidados.

## ✨ Funcionalidades Principais

- 🏠 **Página inicial** com apresentação personalizada dos noivos
- 📝 **Formulário RSVP** inteligente com confirmação de presença e registo de convidados
- 🎁 **Galeria de presentes** com formas de contribuição
- 📍 **Localização e detalhes** da cerimónia e almoço
- 🎵 **Música de fundo** opcional e personalizável
- 💾 **Gestão persistente** de convites e reservas com Cloudflare D1
- 🔗 **Links personalizados** no formato `?convite=...`
- 🎟️ **Passe digital** com QR Code para identificação na receção
- 🔐 **Painel admin** com gestão, filtros, exportação CSV e check-in
- 📱 **Design responsivo** otimizado para mobile, tablet e desktop
- 💌 **Mensagens aleatórias** personalizadas e emocionantes

## 🛠️ Tech Stack

| Tecnologia | Versão | Propósito |
| --- | --- | --- |
| **Next.js** | 16.2.6 | Framework React |
| **React** | 19.2.6 | UI e componentes |
| **TypeScript** | Latest | Type safety |
| **Vite** | Latest | Build rápido e dev server |
| **Tailwind CSS** | 4.x | Estilo e design system |
| **Drizzle ORM** | 0.45.2 | ORM para D1 |
| **Cloudflare D1** | - | Banco de dados SQLite serverless |
| **Cloudflare Workers** | - | Execução serverless |
| **shadcn-style UI** | - | Componentes acessíveis |

## 📋 Requisitos

- **Node.js**: 22.13 ou superior
- **npm**: incluído com Node.js
- **Cloudflare Account**: Com acesso a Workers e D1
- **Bash e GNU `timeout`**: necessários para o build validado

## 🚀 Começar

### 1. Instalação

```bash
# Instalar dependências
npm install

# Ou com script CI
npm run install:ci
```

### 2. Desenvolvimento

```bash
npm run dev
```

A aplicação fica disponível em <http://localhost:5173>.

### 3. Build para Produção

```bash
npm run build
```

Gera a aplicação otimizada para publicação em `dist/`.

### 4. Deploy no Cloudflare

```bash
npm run deploy:cloudflare
```

Aplica migrações D1 e faz deploy dos Workers

## 📁 Estrutura do Projeto

```text
app/
├── page.tsx                 # Página principal do convite
├── presentes/page.tsx       # Página de presentes
├── admin/page.tsx           # Painel admin (protegido)
├── admin/check-in/page.tsx  # Check-in dos convidados
└── api/
  ├── admin/               # APIs de gestão e check-in
  ├── gifts/               # API de presentes
  └── rsvp/                # API de confirmações

app/evento.ics/route.ts      # Ficheiro de calendário do evento

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
drizzle/                      # Migrações SQL do D1
```

## ⚙️ Configuração

### Dados do Evento

Os dados principais do evento estão em [lib/wedding.ts](lib/wedding.ts):

```typescript
export const WEDDING = {
  couple: "Anastácia & Bina",
  ceremonyDateLabel: "19 de dezembro de 2026",
  rsvpDeadlineLabel: "30 de novembro de 2026",
  // horários, locais e links de mapas também ficam neste objeto
};
```

**Campos a personalizar:**

- ✏️ Nomes dos noivos
- 📅 Data, hora e local do evento
- 👨‍👩‍👧‍👦 Família e relação com convidados
- 📱 Número WhatsApp para confirmações
- 🗺️ Link Google Maps do local

### Senha administrativa

Configure o segredo `ADMIN_PASSWORD` no ambiente do Cloudflare. Ele protege o
painel `/admin` e não deve ser guardado no repositório:

```bash
wrangler secret put ADMIN_PASSWORD
```

## 💾 Base de Dados

### Configuração D1

O projeto usa **Cloudflare D1** (SQLite serverless):

- **Binding**: `DB`
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

# Aplicar remotamente
wrangler d1 migrations apply <nome-do-banco> --remote
```

## 🔐 Painel Admin

Acesso protegido em `/admin`:

- Visualizar todas as confirmações
- Filtrar por estado (pendente, confirmado, não comparece)
- Editar status manualmente
- Exportar lista de convidados
- Estatísticas em tempo real

**Autenticação**: Password configurável em variáveis de ambiente

O fluxo de check-in está disponível em `/admin/check-in` e aceita o código ou
o link do convite. Cada convite pode conter uma ou duas pessoas.

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
- Segredo `ADMIN_PASSWORD` configurado
- Binding D1 `DB` disponível
- Migrações D1 necessárias presentes no repositório

## 📦 Componentes Principais

| Componente | Localização | Descrição |
| --- | --- | --- |
| **RSVP Form** | [components/rsvp-form.tsx](components/rsvp-form.tsx) | Formulário de confirmação com validação |
| **Guest Admin** | [components/guest-admin.tsx](components/guest-admin.tsx) | Painel de gestão de convidados |
| **Love Message** | [components/random-love-message.tsx](components/random-love-message.tsx) | Mensagens aleatórias personalizadas |
| **Music Player** | [components/music-player.tsx](components/music-player.tsx) | Controlo de música de fundo |
| **UI Library** | [components/ui/](components/ui/) | Componentes reutilizáveis (50+) |

## 🎨 Customização Visual

### Cores e Tipografia

Os estilos principais estão em [app/globals.css](app/globals.css), com Tailwind
CSS 4 e tokens visuais definidos no próprio arquivo.

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
npm install
```

### D1 connection failed

```bash
# Testar ligação
wrangler d1 execute <nome-do-banco> --remote --command "SELECT 1"
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

## Personalização antes de partilhar

Antes de enviar o convite para os convidados, recomenda-se confirmar:

- texto da data e hora;
- descrição do local;
- endereço completo ou link de mapa;
- número de WhatsApp final;
- lista de presentes e valores/contribuições;
- texto final da mensagem principal do convite.

Antes de enviar os links aos convidados, valide também o fluxo completo de
RSVP, consulta de presentes e check-in num ambiente com D1 configurado.

## Comandos rápidos

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run test
```
