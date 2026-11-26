# Relatório de construção do site da DLS

Criado em 26/11/2026 no repositório de código (`Site_DLS_Codigo/docs/`), com base no `Site_DLS_Plano_do_Projeto.md` (v15), no `Manual_Marca_DLS.pdf` (v1.4) e no `Biblioteca_Visual_Indice.md` (v8).

Nota de governança: pela regra 2 do `AGENTS.md`, este documento foi salvo no repositório de código para que o Douglas (ou a rotina da pasta `Marketing`) decida e registre oficialmente as alterações no plano vivo e no histórico dentro de `DLS/Marketing/Site_DLS/`.

## 1. O que foi efetivamente construído

- **Stack e arquitetura:** site estático gerado com Astro 5 (`output: "static"`), saída limpa em HTML, CSS e 2,61 kB gzipped de JavaScript de interações e telemetria, mais View Transitions API (`ClientRouter`).
- **Páginas no MVP (4 rotas):**
  - `/` (Início): 9 seções conforme seção 6.1 do plano, incluindo primeira dobra com o símbolo em etapas (`B1`) e `ENT-01` inclinado à direita (`C2`), `IMG-03` enquadrada sem os rabiscos do canto inferior direito, cards das três versões do Diagnóstico, linha de continuidade, método (`Dado · Informação · Ação`), bloco de conhecimento que fica com `IMG-05`, seção "Quem conduz" sem foto, FAQ em acordeão acessível e chamada final.
  - `/diagnostico` (Diagnóstico de Produto): abertura com fatos-chave, três versões (`Jornada`, `Indicadores`, `Backlog`) com efeito de folhas empilhadas (`B2`) e ampliação em lightbox, navegação lateral fixa das 4 etapas no desktop (`B3`, ativa a partir de `1024 px`), pré-requisitos, limites do serviço e continuidade com `ENT-04`.
  - `/sobre` (Sobre): abertura, origem do símbolo na arquitetura (sem foto pessoal, exibindo o símbolo oficial dentro da área de proteção), método (`Dado · Informação · Ação` com referência a DIKW, Ackoff, 1989) e três compromissos de trabalho.
  - `/privacidade` (Aviso de privacidade): texto curto de transparência para a LGPD sobre medição sem cookies e uso dos dados enviados via WhatsApp ou e-mail.
- **Estrutura futura preparada:** coleção Markdown em `src/content.config.ts` para o futuro `/conteudos`, sem rota pública no lançamento.
- **Marca e ativos:**
  - Tokens exatos do Manual da Marca v1.4 (`#283211`, `#7B9447`, `#C9D3A6`, `#F5F5F2`, `#22262B`, `#6B7280`, `#D9DDE2`, `Inter` hospedada localmente nos pesos 400, 500, 600 e 700).
  - SVGs oficiais e favicons extraídos do `DLS_Kit_Marca.zip`.
  - Sete peças aprovadas copiadas de `Biblioteca_Visual/02_Aprovado/` para `src/assets/images/` mantendo os nomes originais e otimizadas para WebP pelo Astro (`ENT-01` a `ENT-04`, `IMG-03`, `IMG-04` e `IMG-05`).
- **Acessibilidade e conformidade técnica:**
  - Contraste medido conforme WCAG 2.1: botão primário (`#FFFFFF` sobre `#7B9447`, 19 px negrito) com `3,40:1` (atende texto grande `>= 3,0:1`, decisão A1); títulos sobre branco `13,51:1` e sobre papel `12,37:1`; texto corrido sobre branco `15,22:1` e sobre papel `13,93:1`; texto secundário sobre branco `4,83:1`; texto claro sobre escuro `12,37:1`; sálvia sobre escuro `8,59:1`; rodapé `10,44:1`.
  - Conteúdo 100% visível sem JavaScript (`A2`), com revelações progressivas ativadas apenas quando `html.js-ready` é marcado por script.
  - Todas as animações respeitam `prefers-reduced-motion: reduce` (`A3`).
  - Menu móvel acessível (alvo mínimo de `44 px`) com fallback `<noscript>` abaixo de `900 px`.
  - Auditoria de copy confirmou ausência de termos vetados, travessões, emojis, preços, "gratuito", "Raio-X", menções à Lunta ou ao empregador CLT.
- **SEO, GEO e telemetria sem cookies:**
  - Uso consistente de "produto digital" em títulos, descrições e aberturas.
  - `sitemap-index.xml`, `sitemap-0.xml`, `robots.txt`, links canônicos, Open Graph e dados estruturados JSON-LD (`ProfessionalService`, `Service`, `FAQPage`).
  - Cloudflare Web Analytics e PostHog em modo somente memória (zero cookies, zero `localStorage`/`sessionStorage`), ambos controlados por variáveis de ambiente no `.env` e prontos para receber as chaves.

## 2. O que mudamos conscientemente em relação ao plano v15

| Item | O que estava no plano v15 | Decisão tomada em 26/11/2026 | Motivo |
|---|---|---|---|
| Protótipo v3 em HTML único | Construir `Site_DLS_Prototipo_v3` em HTML único antes de reescrever em Astro (seção 9.1) | Construção direta em Astro já com todo o escopo do v3 (`A1` a `A3`, `B1` a `B3`, `C2`) | Prazo curto até o lançamento na primeira semana de dezembro; evita retrabalho de reescrita |
| Integração com calendário e rota `/agendar` | Página `/agendar` com Google Agenda ou Cal.com incorporado (seções 5, 6.4 e 13) | Sem integração com calendário; rota `/agendar` removida (MVP fica com 4 páginas) | Sem agenda incorporada, a página intermediária criava fricção e um clique redundante antes do WhatsApp; a saudação automática do WhatsApp (seção 4.3) já faz a triagem inicial |
| Texto e destino do botão principal | "Agendar conversa" apontando para `/agendar` (seção 4.2) | "Agendar pelo WhatsApp" com ícone discreto (traço 1,5 px), abrindo diretamente `https://wa.me/5531982747532` com mensagem pré-preenchida | Clareza de destino antes do clique e eliminação de etapa intermediária; e-mail mantido como alternativa na chamada final e no rodapé |
| Catálogo de eventos da telemetria | `EVT-01` a `EVT-09`, incluindo `agendamento_iniciado` (`EVT-08`) e `agendamento_concluido` (`EVT-09`) (seção 11) | Implementados `EVT-01` a `EVT-07`; `EVT-08` e `EVT-09` retirados do código | A confirmação de horário acontece no WhatsApp; a conversão medida no site passa a ser `cta_clicado` e `contato_clicado {canal: whatsapp}`, com atribuição de origem pela mensagem pré-preenchida |
| Retrato do Douglas | Em teste no protótipo v2; decisão de lançar sem foto na seção 6.1 | Confirmado lançamento sem foto em "Quem conduz" e `/sobre`; `/sobre` exibe o símbolo oficial da marca | Decisão confirmada pelo Douglas (direito de uso da `FOT-01` pendente e sem sessão de fotos agora) |
| Uso das peças aprovadas | `IMG-03`, `IMG-04`, `IMG-05` e `ENT-01` a `ENT-04` aprovadas em 26/11 | `ENT-01` a `ENT-04`, `IMG-03` e `IMG-05` aplicadas no site; `IMG-04` mantida no repositório sem uso forçado | Evitar imagem decorativa sem função específica nas 4 páginas atuais (regra 8 da biblioteca visual) |
| Contraste de overlines, etiquetas e texto secundário sobre papel | Protótipo v2 usava `#7B9447` em texto pequeno e `#6B7280` sobre `#F5F5F2` | Overlines e etiquetas em `#283211` sobre fundos claros (com barra/borda gráfica em `#7B9447`); texto sobre `#F5F5F2` em `#22262B` | Cumprir WCAG 2.1 (`>= 4,5:1`) sem inventar nenhuma cor fora do Manual da Marca v1.4 |

## 3. Pontos para atualizar em `DLS/Marketing/Site_DLS/Site_DLS_Plano_do_Projeto.md`

Quando for consolidar a próxima versão do plano na pasta `Marketing`, atualizar:

1. **Seção 4.2 (Textos de chamada):** registrar o botão principal como "Agendar pelo WhatsApp" apontando direto para o WhatsApp comercial `(31) 98274-7532`, com o e-mail `douglas@dlsestrategia.com.br` como alternativa na chamada final.
2. **Seção 5 e 6.4 (Arquitetura de páginas):** remover `/agendar` do MVP (passa para 4 páginas: `/`, `/diagnostico`, `/sobre`, `/privacidade`).
3. **Seção 9.1 (Protótipo v3):** registrar que o escopo do v3 foi absorvido diretamente na construção em Astro.
4. **Seção 11 (Telemetria):** encerrar `EVT-08` e `EVT-09` nesta fase e recalibrar `IND-01`, `IND-02`, `IND-05` e `IND-06` para medir conversão no clique do WhatsApp (`cta_clicado` / `contato_clicado`) combinada ao controle manual de agendamentos no WhatsApp.
5. **Seção 13 (Infraestrutura):** remover a previsão de Google Agenda / Cal.com.

## 4. Pendências antes de publicar

- Obter e inserir no `.env` (e depois no Cloudflare Pages) as chaves de `PUBLIC_CF_ANALYTICS_TOKEN` e `PUBLIC_POSTHOG_KEY`.
- Revisar os textos de "Quem conduz" (`/`) e "Origem" (`/sobre`) frente à cláusula CLT (seção 14, risco 1).
- Conferência visual final em `1440`, `1280`, `1024`, `768` e `390 px` no ambiente local.
- Autorização explícita do Douglas para commit, `git push`, conexão ao Cloudflare Pages e apontamento do CNAME `www` na Hostinger.
