import Link from 'next/link';

export const Header = () => {
  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none' }}>
        <li>
          <Link href='/' aria-label='Home'>
            <a>Home&nbsp;</a>
          </Link>
        </li>
        <li>
          <Link href='/create-token' aria-label='Create Token'>
            <a>Create Token&nbsp;</a>
          </Link>
        </li>
        <li>
          <Link href='/about' aria-label='About'>
            <a>About&nbsp;</a>
          </Link>
        </li>
        <li>
          <Link href='/articles' aria-label='Articles'>
            <a>Articles&nbsp;</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
