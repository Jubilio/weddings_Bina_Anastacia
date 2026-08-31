# Convite de casamento — Bina & Anastácia

Landing page responsiva com:

- convite da Família Hilário;
- confirmação de presença por WhatsApp;
- lista de presentes;
- dados para contribuição via Millennium BIM, M-Pesa e e-Mola;
- espaço preparado para data e localização.

## Executar localmente

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

## Gerar a versão de produção

```bash
npm run build
```

## Configuração principal

Os nomes, links e o número que recebe as confirmações estão centralizados no
objeto `invitation`, no início do ficheiro `app/page.tsx`.

Atualmente, a confirmação de presença é enviada para o WhatsApp associado ao
número M-Pesa fornecido: `+258 84 458 4164`.

Antes da partilha final, substitua no mesmo ficheiro:

- o texto provisório da data e hora;
- o texto provisório da localização;
- o link `#localizacao` por um endereço do Google Maps, se desejar abrir o
  mapa diretamente.
