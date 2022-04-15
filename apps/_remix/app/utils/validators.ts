import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';

export const SolanaLoginSchema = z.object({
  publicKey: z.string(),
  signature: z.string(),
});

export type SolanaLoginSchema = z.infer<typeof SolanaLoginSchema>;

/**
 * These properties are used to verify a solana wallet login / connection.
 */
export const solanaLoginValidator = withZod(SolanaLoginSchema);
