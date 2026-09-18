# Anastácia & Bina — Convites para imprimir

Gerador estático independente do convite principal, isolado na pasta `print-studio/`. Não tem acesso à base de dados nem a APIs de convidados. Os nomes introduzidos ficam apenas na memória do navegador.

## Utilização

1. Preencher o nome de uma ou duas pessoas.
2. Rever o telefone e, se necessário, editar o programa (até 6 actividades).
3. Escolher Capa, Convite ou Programa para descarregar cada PNG.
4. Escolher os cartões a imprimir e usar «Imprimir / guardar PDF».

Formato A5 vertical (148 × 210 mm), 1748 × 2480 pixels, PNG com metadados de 300 ppp. Impressão em tamanho real, sem cabeçalhos/rodapés. A impressora pode exigir margens físicas; para corte profissional, imprimir em papel maior. Não inclui sangria. Cada cartão ocupa uma página PDF; a opção «Guardar como PDF» é do navegador. Os nomes longos ajustam-se automaticamente dentro do espaço reservado. O programa mantém apenas os dois horários confirmados como valores iniciais.

Dados de referência, verificados no convite principal em 18/09/2026: casamento em 19/12/2026; cerimónia às 10h00 no Conservatório, Cidade de Nampula; almoço às 14h00 no Salão de Eventos da Academia Militar; confirmação até 30/11/2026; telefone +258 84 458 4164. As imagens são cópias dos assets do convite, preservando os originais. Alterar este gerador não altera o convite principal.

## Publicação independente na Cloudflare

A configuração `wrangler.jsonc` usa um Worker novo chamado `convites-impressos-bina-anastacia`, sem bindings nem migrações. Depois de autenticar a conta Cloudflare correcta, executar nesta pasta:

```
npx wrangler deploy --config wrangler.jsonc
```

O endereço workers.dev é atribuído pela Cloudflare na conta autenticada. Não se deve executar este comando com a configuração do convite principal. Não publicar sobre o Worker existente. Pode também carregar a pasta `dist` num novo projecto Cloudflare Pages. O site de geração deverá ter acesso reservado ao casal se forem acrescentadas funções administrativas.

## Desenvolvimento

Não requer instalação nem compilação. Servir `dist` com um servidor HTTP estático. `node --check dist/app.js` verifica a sintaxe. Não abrir directamente como file://: o download a partir do canvas requer assets da mesma origem HTTP.

## Configurar um novo Worker ligado a este repositório

No Cloudflare Workers, criar um projecto novo com este repositório, definir a pasta raiz como `print-studio`, deixar o comando de build vazio e usar `npx wrangler deploy --config wrangler.jsonc` como comando de deploy. O nome do Worker deve ser `convites-impressos-bina-anastacia`. O merge no repositório não cria esse Worker automaticamente nem altera o deploy do convite principal.

Não é necessário copiar a configuração de Sites: este gerador tem configuração Cloudflare própria. Não modificar os ficheiros da aplicação na raiz nem a sua base de dados.
