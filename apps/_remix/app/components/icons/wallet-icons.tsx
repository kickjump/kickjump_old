import type { IconProps } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';

export const GlowWalletIcon = (props: IconProps) => (
  <Icon viewBox='0 0 254 254' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <circle cx='126.55' cy='126.55' r='105.55' fill='white' />
    <circle
      cx='126.55'
      cy='126.55'
      r='116.05'
      stroke='white'
      strokeOpacity='0.5'
      strokeWidth='21'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M200.576 201.797C181.525 220.54 155.389 232.104 126.552 232.104C97.7787 232.104 71.6944 220.591 52.6544 201.92C95.8806 167.876 157.305 167.835 200.576 201.797ZM201.796 200.577C220.54 181.526 232.104 155.39 232.104 126.552C232.104 97.7866 220.597 71.7087 201.936 52.6701C167.876 96.0129 167.83 157.321 201.796 200.577ZM200.735 51.4649C157.403 85.5945 95.7823 85.5531 52.4946 51.3408C71.5483 32.5776 97.6981 21 126.552 21C155.47 21 181.671 32.6287 200.735 51.4649ZM51.3408 52.4946C32.5776 71.5483 21 97.6981 21 126.552C21 155.47 32.6287 181.671 51.4649 200.735C85.5945 157.403 85.5531 95.7823 51.3408 52.4946Z'
      fill='black'
    />
  </Icon>
);

export const PhantomWalletIcon = (props: IconProps) => (
  <Icon viewBox='0 0 128 128' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <circle cx='64' cy='64' r='64' fill='url(#phantom_paint0_linear)' />
    <path
      d='M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.6612 23 14.8716 41.3057 14.4118 64.0583C13.936 87.577 36.241 108 60.0186 108H63.0094C83.9723 108 112.069 91.7667 116.459 71.9874C117.27 68.3413 114.358 64.9142 110.584 64.9142ZM39.7689 65.9454C39.7689 69.0411 37.2095 71.5729 34.0802 71.5729C30.9509 71.5729 28.3916 69.0399 28.3916 65.9454V56.8414C28.3916 53.7457 30.9509 51.2139 34.0802 51.2139C37.2095 51.2139 39.7689 53.7457 39.7689 56.8414V65.9454ZM59.5224 65.9454C59.5224 69.0411 56.9631 71.5729 53.8338 71.5729C50.7045 71.5729 48.1451 69.0399 48.1451 65.9454V56.8414C48.1451 53.7457 50.7056 51.2139 53.8338 51.2139C56.9631 51.2139 59.5224 53.7457 59.5224 56.8414V65.9454Z'
      fill='url(#phantom_paint1_linear)'
    />
    <defs>
      <linearGradient
        id='phantom_paint0_linear'
        x1='64'
        y1='0'
        x2='64'
        y2='128'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#534BB1' />
        <stop offset='1' stopColor='#551BF9' />
      </linearGradient>
      <linearGradient
        id='phantom_paint1_linear'
        x1='65.4998'
        y1='23'
        x2='65.4998'
        y2='108'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='white' />
        <stop offset='1' stopColor='white' stopOpacity='0.82' />
      </linearGradient>
    </defs>
  </Icon>
);
