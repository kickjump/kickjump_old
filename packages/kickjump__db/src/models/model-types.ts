import type { Account, Email, User } from '@kickjump/prisma';

import type { ACCOUNT_FIELDS } from './model-constants';

export interface PopulatedAccount extends Pick<Account, keyof typeof ACCOUNT_FIELDS> {}

export interface PopulatedUser extends User {
  emails: Email[];
  /**
   * A safe representation of the user account (without sensitive data)
   */
  accounts: PopulatedAccount[];
}
