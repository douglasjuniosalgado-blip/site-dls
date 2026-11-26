import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Estrutura preparada para o futuro blog em /conteudos (seção 12 do plano).
 * Nenhuma rota pública é gerada no MVP do lançamento.
 */
const conteudos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conteudos' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    publicadoEm: z.coerce.date(),
    atualizadoEm: z.coerce.date().optional(),
    rascunho: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { conteudos };
