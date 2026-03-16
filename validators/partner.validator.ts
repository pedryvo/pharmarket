import { z } from 'zod';

export const partnerSchema = z.object({
  name: z.string().min(1, 'Nome da farmácia é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  wa: z.string().min(1, 'WhatsApp é obrigatório'),
  rt: z.string().min(1, 'Responsável Técnico é obrigatório'),
  pharmacistEmail: z.string().email('E-mail do farmacêutico inválido'),
  active: z.boolean().default(true),
  specs: z.array(z.string()).default([])
});

export const updatePartnerSchema = partnerSchema.partial();

export const partnerFormSchema = z.object({
  name: z.string().min(1),
  city: z.string().min(1),
  wa: z.string().min(1),
  rt: z.string().min(1),
  pharmacistEmail: z.string().email(),
  active: z.boolean().optional(),
  specsRaw: z.string().optional().transform(val => 
    val ? val.split(',').map(s => s.trim()).filter(Boolean) : []
  )
});
