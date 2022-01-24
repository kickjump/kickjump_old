import { Link } from 'remix';

export const Header = () => {
  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none' }}>
        <li>
          <Link to='/' title='Home' aria-label='Home'>
            Home&nbsp;
          </Link>
        </li>
        <li>
          <Link to='/create-token' title='Create Token' aria-label='Create Token'>
            Create Token&nbsp;
          </Link>
        </li>
        <li>
          <Link to='/about' title='About' aria-label='About'>
            About&nbsp;
          </Link>
        </li>
      </ul>
    </nav>
  );
};
