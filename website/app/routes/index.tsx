import { Header } from '~/components/header';

export default function Index() {
  return (
    <>
      <Header />
      <main style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
        <h1>KickJump</h1>
        <p>Welcome to KickJump.</p>
      </main>
    </>
  );
}
