export const SITE = {
  name: 'DLS Estratégia e Consultoria',
  shortName: 'DLS',
  descriptor: 'estratégia e consultoria',
  signature: 'Dado · Informação · Ação',
  url: 'https://www.dlsestrategia.com.br',
  email: 'douglas@dlsestrategia.com.br',
  whatsappNumber: (import.meta.env.PUBLIC_WHATSAPP_NUMBER || '5531982747532').replace(/\D/g, ''),
  whatsappDisplay: '(31) 98274-7532',
  whatsappPrefill: 'Olá, vim pelo site da DLS.',
  whatsappBookingPrefill:
    'Olá, vim pelo site da DLS. Quero agendar uma conversa sobre meu produto digital.',
  cfAnalyticsToken: (import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN || '').trim(),
  posthogKey: (import.meta.env.PUBLIC_POSTHOG_KEY || '').trim(),
  posthogHost: (import.meta.env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/+$/, ''),
} as const;

export function getWhatsappUrl(customMessage?: string): string {
  const message = customMessage || SITE.whatsappPrefill;
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getWhatsappBookingUrl(): string {
  return getWhatsappUrl(SITE.whatsappBookingPrefill);
}

export const NAV_LINKS = [
  { href: '/', label: 'Início', key: 'inicio' },
  { href: '/diagnostico', label: 'Diagnóstico', key: 'diagnostico' },
  { href: '/sobre', label: 'Sobre', key: 'sobre' },
] as const;
