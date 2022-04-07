import chalk from 'chalk';
import shell from 'shelljs';

const ANCHOR_VERSION = '0.23.0';

// if anchor is already installed don't do anything
let current = shell.exec('anchor --version').stdout.trim();

if (current === `anchor-cli ${ANCHOR_VERSION}`) {
  console.log(chalk.gray(`Anchor is already installed`), chalk.bold.gray(ANCHOR_VERSION));
  console.log('');
  process.exit(0);
}

if (shell.which('avm')) {
  console.log(chalk.yellow(`Installing anchor with`, chalk.bold.yellow(`avm`)));
  console.log('');
  shell.exec(`avm use ${ANCHOR_VERSION}`);
} else {
  console.log(chalk.yellow(`Installing anchor with`, chalk.bold.yellow(`avm`)));
  shell.exec(
    `cargo install --git https://github.com/project-serum/anchor --tag "v${ANCHOR_VERSION}" anchor-cli --locked`,
  );
}
