import type { ProviderProps } from '@react-aria/i18n';
import { I18nProvider } from '@react-aria/i18n';
import { SSRProvider } from '@react-aria/ssr';

import { SolanaProvider } from './solana-provider';

export const Provider = (props: ProviderProps) => {
  const { children, locale } = props;

  return (
    <SSRProvider>
      <I18nProvider locale={locale}>
        <SolanaProvider>{children}</SolanaProvider>
      </I18nProvider>
    </SSRProvider>
  );
};
