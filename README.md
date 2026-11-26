# Site DLS Estratégia e Consultoria

Site estático desenvolvido em **Astro**, construído a partir do plano vivo em `Marketing/Site_DLS/Site_DLS_Plano_do_Projeto.md` e do Manual da Marca DLS v1.4.

## Comandos locais

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha conforme obtiver as chaves (o arquivo `.env` não entra no Git):

- `PUBLIC_WHATSAPP_NUMBER`: número comercial apenas com dígitos (DDI + DDD + número).
- `PUBLIC_CF_ANALYTICS_TOKEN`: token do Cloudflare Web Analytics (sem cookies).
- `PUBLIC_POSTHOG_KEY`: Project API Key do PostHog (configurado apenas em memória da sessão, sem cookies).
- `PUBLIC_POSTHOG_HOST`: `https://us.i.posthog.com` (ou `https://eu.i.posthog.com`, conforme a região escolhida na criação da conta).

No Cloudflare Pages, configure essas mesmas variáveis em **Settings > Environment variables** antes de publicar.
