# AGENTS.md | Site da DLS Estratégia e Consultoria

Regras para qualquer agente que trabalhe neste projeto (Antigravity, Claude, Codex ou outro). Criado em 26/11/2026 por Claude, a pedido do Douglas Júnio. Texto de referência: `Meus Projetos_/_instrucoes/Instrucoes_Antigravity.md`.

## 1. As duas pastas do projeto

- Esta pasta (`DLS_Repositorio_Codigos/Site_DLS_Codigo`) é a pasta de trabalho. Todo código, configuração, dependências, build e imagens usadas no site ficam aqui. É aqui que você cria e edita arquivos.
- A pasta `Marketing` (`Meus Projetos_/DLS/Marketing`) é fonte de consulta, somente leitura. Ela pertence à base de trabalho do Douglas, que tem governança própria (registro de cada alteração, rotina de consolidação, versões).

## 2. O que nunca fazer na pasta Marketing

- Não criar, editar, mover, renomear nem apagar nenhum arquivo ou pasta dentro de `Marketing`.
- Não rodar comandos (instalação, build, formatadores, scripts) dentro de `Marketing`.
- Se uma tarefa parecer exigir mudança em `Marketing` (o plano está errado, falta uma imagem, o texto precisa mudar), pare e diga ao Douglas o que mudaria e por quê. Ele decide e registra a mudança na pasta.

## 3. Onde está a especificação

- Plano do site, que é a especificação: `Marketing/Site_DLS/Site_DLS_Plano_do_Projeto.md`. Seções principais: 4 (conversão), 5 (páginas), 6 (texto de cada página), 7 (regras de texto), 8 (direção de arte e papel das imagens), 9 e 9.1 (movimento e plano do protótipo v3), 10 e 10.1 (responsividade, desempenho, SEO e GEO), 11 (telemetria), 13 (infraestrutura).
- Protótipo de referência: `Marketing/Site_DLS/Site_DLS_Prototipo_v2_2026-11-18.html` (o mais recente na pasta; versões anteriores em `versoes/`).
- Marca: `Marketing/Marca/Manual_Marca_DLS.pdf`, `DLS_Kit_Marca.zip` e `dls-simbolo.svg`. Cores, fontes e símbolo vêm só daí; nunca invente cor, fonte ou variação do símbolo.
- Imagens: só as de `Marketing/Marca/Biblioteca_Visual/02_Aprovado/`. Para usar uma imagem, copie-a para este repositório (por exemplo, `src/assets/`), mantendo o nome. As de `01_Teste/` servem só para protótipo e nunca vão para o site publicado.
- Se o plano e o protótipo divergirem, vale o plano. Se algo não estiver no plano, pergunte.

## 4. Regras de conteúdo (resumo da seção 7 do plano)

- Português do Brasil, sem travessão no meio do texto, sem emojis.
- Usar sempre "produto digital" nos títulos, descrições e textos de abertura.
- Nenhum preço no site e nenhuma promessa de resultado numérico. Não dizer que a conversa é gratuita.
- Nunca contrapor a DLS a quem constrói (time próprio ou fornecedor de desenvolvimento): o discurso é sobre processo.
- Termos vetados: mentoria, treinamento, curso, aula, palestra, workshop; consultoria empresarial ou de gestão; alocação, squad, horas à disposição, PO terceirizado; design de interface como execução; desenvolvimento de software como serviço da DLS.
- Não citar o empregador anterior do Douglas, clientes nem a Lunta.
- Exemplos de entregáveis são sempre fictícios e sinalizados como tal.

## 5. Regras técnicas

- Stack prevista: Astro (site estático) publicado no Cloudflare Pages a partir de repositório Git. Mudança de stack só com aprovação do Douglas.
- Responsivo, não mobile-first; conferir em 1440, 1280, 1024, 768 e 390 px.
- Metas de desempenho: LCP até 2,5 s, INP até 200 ms e CLS até 0,1 (Core Web Vitals, faixa "bom").
- Acessibilidade: contraste mínimo de 4,5:1 para texto normal (WCAG 2.1, critério 1.4.3); foco visível; alvos de toque de 44 px no celular.
- Movimento: curto (200 a 500 ms), sempre com função, respeitando `prefers-reduced-motion`; nenhum conteúdo escondido se o JavaScript não rodar.
- Telemetria só a prevista no plano (Cloudflare Web Analytics e PostHog sem cookies); nada de Google Analytics nem banner de cookies sem decisão do Douglas.
- Nenhuma chave, token ou senha no código. Segredos ficam em variáveis de ambiente fora do repositório.
- Não fazer `git push`, publicar, nem criar contas ou serviços externos sem pedido explícito do Douglas.

## 6. Como trabalhar com o Douglas

- Postura consultiva: antecipe erros e riscos, explique o porquê das escolhas, separe fato de hipótese e cite a fonte.
- Antes de uma mudança grande, apresente o plano e espere o ok.
- Ao terminar uma tarefa, diga em poucas linhas o que mudou, o que ficou fora do plano e o que o Douglas precisa decidir.
