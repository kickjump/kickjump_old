import type { IconProps } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';

export const SolanaIcon = (props: IconProps) => {
  const { color = '#66F9A1' } = props;

  return (
    <Icon viewBox='0 0 32 32' color={color} {...props}>
      <path
        fill='currentColor'
        d='M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm8.706 19.517H10.34a.59.59 0 0 0-.415.17l-2.838 2.815a.291.291 0 0 0 .207.498H21.66a.59.59 0 0 0 .415-.17l2.838-2.816a.291.291 0 0 0-.207-.497zm-3.046-5.292H7.294l-.068.007a.291.291 0 0 0-.14.49l2.84 2.816.07.06c.1.07.22.11.344.11h14.366l.068-.007a.291.291 0 0 0 .14-.49l-2.84-2.816-.07-.06a.59.59 0 0 0-.344-.11zM24.706 9H10.34a.59.59 0 0 0-.415.17l-2.838 2.816a.291.291 0 0 0 .207.497H21.66a.59.59 0 0 0 .415-.17l2.838-2.815A.291.291 0 0 0 24.706 9z'
      />
    </Icon>
  );
};
