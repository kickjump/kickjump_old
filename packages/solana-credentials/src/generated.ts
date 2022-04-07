export interface SolanaCredentials {
  version: '0.0.0';
  name: 'solana_credentials';
  instructions: [
    {
      name: 'initialize';
      accounts: [];
      args: [];
    },
  ];
}

export const IDL: SolanaCredentials = {
  version: '0.0.0',
  name: 'solana_credentials',
  instructions: [
    {
      name: 'initialize',
      accounts: [],
      args: [],
    },
  ],
};
