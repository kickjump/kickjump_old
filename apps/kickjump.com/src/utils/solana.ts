/**
 * Get the wallet message on both the server and client.
 *
 * TODO make this use a i18n string - perhaps lingui.
 */
export function getWalletMessage(props: GetWalletMessageProps) {
  const { nonce, type } = props;

  const messages = {
    connect: `Sign this message for authenticating with your wallet.\n\nSecurity Nonce: ${nonce}`,
    login: `Login with your wallet.\n\nSecurity Nonce: ${nonce}`,
  };

  return messages[type];
}

interface GetWalletMessageProps {
  nonce: string;
  type: 'connect' | 'login';
}
