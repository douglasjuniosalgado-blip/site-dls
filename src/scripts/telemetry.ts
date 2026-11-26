/**
 * Telemetria sem cookies (PostHog em memória da sessão, seção 11 do plano).
 * Nenhum dado é gravado em cookie, localStorage ou sessionStorage.
 * Enquanto PUBLIC_POSTHOG_KEY estiver vazia, nenhuma requisição é enviada.
 */

type TelemetryPayload = Record<string, string | number | boolean | undefined>;

interface TelemetryConfig {
  posthogKey: string;
  posthogHost: string;
}

let sessionDistinctId: string | null = null;
let sessionId: string | null = null;
let configCache: TelemetryConfig | null = null;
let scrollThresholdsSent = new Set<number>();
let viewedSections = new Set<string>();
let activeSectionTimers = new Map<Element, number>();
let sectionObserver: IntersectionObserver | null = null;
let scrollListenerBound = false;
let clickListenersBound = false;

function generateMemoryId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `dls-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getConfig(): TelemetryConfig {
  if (configCache) return configCache;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="dls-telemetry"]');
  const posthogKey = meta?.dataset.posthogKey?.trim() || '';
  const posthogHost = (meta?.dataset.posthogHost?.trim() || 'https://us.i.posthog.com').replace(
    /\/+$/,
    '',
  );
  configCache = { posthogKey, posthogHost };
  return configCache;
}

function getOriginSummary(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const result: Record<string, string> = {};
  const utmParts: string[] = [];

  for (const key of utmKeys) {
    const val = params.get(key);
    if (val) {
      result[key] = val;
      utmParts.push(`${key}=${val}`);
    }
  }

  if (utmParts.length > 0) {
    result.origem = utmParts.join('&');
  } else if (document.referrer) {
    try {
      result.origem = new URL(document.referrer).hostname;
    } catch {
      result.origem = 'referencia';
    }
  } else {
    result.origem = 'direto';
  }

  return result;
}

export function trackEvent(eventName: string, properties: TelemetryPayload = {}): void {
  const { posthogKey, posthogHost } = getConfig();
  if (!posthogKey) return;

  if (!sessionDistinctId) sessionDistinctId = generateMemoryId();
  if (!sessionId) sessionId = generateMemoryId();

  const body = JSON.stringify({
    api_key: posthogKey,
    event: eventName,
    distinct_id: sessionDistinctId,
    timestamp: new Date().toISOString(),
    properties: {
      $current_url: window.location.href,
      $pathname: window.location.pathname,
      $session_id: sessionId,
      $process_person_profile: false,
      ...properties,
    },
  });

  const endpoint = `${posthogHost}/capture/`;

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      const queued = navigator.sendBeacon(endpoint, blob);
      if (queued) return;
    }
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      mode: 'cors',
    }).catch(() => {});
  } catch {
    // Falhas de rede nunca devem interromper a experiência do visitante
  }
}

function handleScrollDepth(): void {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return;

  const pct = Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100);
  const pagina = window.location.pathname || '/';

  for (const milestone of [25, 50, 75, 90]) {
    if (pct >= milestone && !scrollThresholdsSent.has(milestone)) {
      scrollThresholdsSent.add(milestone);
      trackEvent('scroll_profundidade', { percentual: milestone, pagina });
    }
  }
}

function setupSectionVisibility(): void {
  if (sectionObserver) {
    sectionObserver.disconnect();
    sectionObserver = null;
  }
  activeSectionTimers.forEach((timerId) => window.clearTimeout(timerId));
  activeSectionTimers.clear();
  viewedSections = new Set<string>();

  const targets = document.querySelectorAll<HTMLElement>('[data-track-section]');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  // EVT-04: seção com 50% visível por 1 s
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const name = (entry.target as HTMLElement).dataset.trackSection;
        if (!name || viewedSections.has(name)) continue;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!activeSectionTimers.has(entry.target)) {
            const timerId = window.setTimeout(() => {
              viewedSections.add(name);
              activeSectionTimers.delete(entry.target);
              trackEvent('secao_visualizada', {
                secao: name,
                pagina: window.location.pathname || '/',
              });
              sectionObserver?.unobserve(entry.target);
            }, 1000);
            activeSectionTimers.set(entry.target, timerId);
          }
        } else {
          const existing = activeSectionTimers.get(entry.target);
          if (existing !== undefined) {
            window.clearTimeout(existing);
            activeSectionTimers.delete(entry.target);
          }
        }
      }
    },
    { threshold: [0.5] },
  );

  targets.forEach((el) => sectionObserver?.observe(el));
}

function bindGlobalListeners(): void {
  if (!clickListenersBound) {
    clickListenersBound = true;

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // EVT-02: cta_clicado
      const cta = target.closest<HTMLElement>('[data-cta]');
      if (cta) {
        trackEvent('cta_clicado', {
          posicao: cta.dataset.cta || 'desconhecida',
          texto: (cta.textContent || '').trim().slice(0, 100),
          destino: cta.getAttribute('href') || '',
        });
      }

      // EVT-03: servico_visualizado
      const servico = target.closest<HTMLElement>('[data-servico]');
      if (servico) {
        trackEvent('servico_visualizado', {
          servico: servico.dataset.servico || '',
        });
      }

      // EVT-07: contato_clicado
      const contato = target.closest<HTMLElement>('[data-contato]');
      if (contato) {
        trackEvent('contato_clicado', {
          canal: contato.dataset.contato || '',
        });
      }
    });

    // EVT-06: faq_aberta
    document.addEventListener(
      'toggle',
      (event) => {
        const el = event.target as HTMLElement | null;
        if (el && el.tagName === 'DETAILS' && (el as HTMLDetailsElement).open && el.dataset.faq) {
          trackEvent('faq_aberta', {
            pergunta: el.dataset.faq,
          });
        }
      },
      true,
    );
  }

  if (!scrollListenerBound) {
    scrollListenerBound = true;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          handleScrollDepth();
          ticking = false;
        });
      },
      { passive: true },
    );
  }
}

export function initTelemetry(): void {
  scrollThresholdsSent = new Set<number>();
  bindGlobalListeners();
  setupSectionVisibility();

  // EVT-01: page_view
  const originData = getOriginSummary();
  trackEvent('page_view', {
    pagina: window.location.pathname || '/',
    ...originData,
  });
}
