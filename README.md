# Convite de casamento — Bina & Anastácia

Website responsivo para um convite de casamento, com visual elegante, texto emocional e estrutura pronta para partilhar com os convidados.

## Funcionalidades

- página inicial com apresentação dos noivos;
- instruções de confirmação de presença;
- formulário de RSVP para registo de convidados;
- lista de presentes e formas de contribuição;
- secção de localização e detalhes do evento;
- música de fundo opcional;
- compatibilidade com Cloudflare D1 via Drizzle ORM.

## Stack

- Next.js 16
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Drizzle ORM
- Cloudflare D1 / Wrangler
- shadcn-style UI primitives

## Requisitos

- Node.js 22.13 ou superior
- npm
- Conta e acesso ao Cloudflare (se quiser usar a base de dados em vez do modo sem BD local)

## Instalação

```bash
npm install
```

## Executar em desenvolvimento

```bash
npm run dev
```

A aplicação fica disponível normalmente em http://localhost:5173, conforme a configuração do Vite.

## Build de produção

```bash
npm run build
```

## Estrutura principal

- [app/page.tsx](app/page.tsx): página principal do convite
- [app/presentes/page.tsx](app/presentes/page.tsx): página de presentes e contribuições
- [components/rsvp-form.tsx](components/rsvp-form.tsx): formulário de confirmação
- [components/random-love-message.tsx](components/random-love-message.tsx): mensagem amorosa aleatória
- [db/schema.ts](db/schema.ts): definição do modelo de dados
- [wrangler.toml](wrangler.toml): configuração do Cloudflare D1
- [scripts/build-verified.sh](scripts/build-verified.sh): script de build validado

## Configuração do convite

Os dados principais do evento e dos contactos estão definidos no objecto `invitation` dentro de [app/page.tsx](app/page.tsx).

Verifica e ajusta:

- nomes dos noivos;
- família do convite;
- data e hora do evento;
- local da cerimónia e almoço;
- número do WhatsApp para confirmações;
- ligação de localização do Google Maps.

## Base de dados

Este projecto usa Cloudflare D1 com Drizzle.

### Configuração do D1

A ligação está definida em [wrangler.toml](wrangler.toml):

- binding: `casamento_bina_anastacia_db`
- database_name: `casamento-bina-anastacia-db`

O schema da tabela de convidados está em [db/schema.ts](db/schema.ts).

Para gerar as migrações do Drizzle:

```bash
npm run db:generate
```

Se a base de dados não estiver disponível localmente, a aplicação tenta continuar sem ela e mostra a interface principal normalmente.

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
