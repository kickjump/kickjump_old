/**
 * Get the wallet message on both the server and client.
 *
 * TODO make this use a i18n string - perhaps lingui.
 */
export function getWalletMessage(props: GetWalletMessageProps) {
  return WalletMessage[props.type](props.nonce);
}

interface GetWalletMessageProps {
  nonce: string;
  type: WalletMessageType;
}

export const WalletMessage = {
  connect: (nonce: string) =>
    `Sign this message for authenticating with your wallet.\n\nSecurity Nonce: ${nonce}`,
  login: (nonce: string) => `Login with your wallet.\n\nSecurity Nonce: ${nonce}`,
};

export type WalletMessageType = keyof typeof WalletMessage;
