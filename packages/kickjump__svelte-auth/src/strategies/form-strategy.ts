import type { StrategyAuthenticateProps } from '../auth/auth-types.js';
import type { AuthenticateReturn } from '../auth/strategy.js';
import { Strategy } from '../auth/strategy.js';

export class FormStrategy extends Strategy<FormData> {
  readonly name = 'form';

  async authenticate(event: StrategyAuthenticateProps): Promise<AuthenticateReturn> {
    const { request } = event;
    const form = await request.formData();
    const user = await this.verify(form);

    return { user };
  }
}
