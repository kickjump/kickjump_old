import { execa } from 'execa';

if (process.platform === 'win32') {
  await execa('iwr', ['https://ps1.edgedb.com', '-useb', '|', 'iex'], { stdio: 'inherit' });
} else {
  await execa(
    'curl',
    ['--proto', "'=https'", '--tlsv1.2', '-sSf', 'https://sh.edgedb.com', '|', 'sh'],
    { stdio: 'inherit' },
  );
}
