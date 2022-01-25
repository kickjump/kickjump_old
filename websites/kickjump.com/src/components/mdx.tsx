import { getMDXComponent } from 'mdx-bundler/client';
import { NextSeo } from 'next-seo';
import { useMemo } from 'react';

import type { MdxItem } from '~/utils/mdx';

/**
 * Convert a markdown string to the underlying components
 */
function useMdxComponent(code: string) {
  return useMemo(() => getMDXComponent(code), [code]);
}

/**
 * Create an `.mdx` component.
 */
export const Mdx = (props: MdxItem) => {
  const { code, frontmatter } = props;
  const Component = useMdxComponent(code);
  const { title = 'Un-named Page' } = frontmatter;

  return (
    <>
      <NextSeo title={title} titleTemplate='%s | KickJump' />
      <h1>{title}</h1>
      <Component />
    </>
  );
};
