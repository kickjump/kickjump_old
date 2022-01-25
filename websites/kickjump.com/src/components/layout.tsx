import { Header } from './header';

interface LayoutProps {
  children: React.ReactChild;
  /**
   * TODO actually use this.
   *
   * @default 'page'
   */
  type?: 'page' | 'article';
}

/**
 * Eventually have multiple layouts.
 */
export const Layout = (props: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{props.children}</main>
      <footer>This is the footer</footer>
    </>
  );
};
