export const ACCOUNT_FIELDS = {
  createdAt: true,
  updatedAt: true,
  type: true,
  id: true,
  provider: true,
  providerAccountId: true,
  scope: true,
} as const;

export const POPULATED_USER = {
  emails: true,
  accounts: { select: ACCOUNT_FIELDS },
  wallets: true,
} as const;
export const NESTED_POPULATED_USER = { user: { include: POPULATED_USER } } as const;
