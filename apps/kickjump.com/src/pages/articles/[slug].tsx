import type { GetStaticPaths, GetStaticProps } from 'next';

import { Mdx } from '~/components/mdx';
import type { MdxItem } from '~/utils/mdx';

const MarkdownPage = (props: MdxItem) => {
  return <Mdx {...props} />;
};

export const getStaticProps: GetStaticProps<MdxItem> = async ({ params }) => {
  const { getArticle } = await import('~/utils/mdx');
  const { string } = await import('superstruct');
  const stringSchema = string();
  const slug = params?.slug;

  if (!stringSchema.is(slug)) {
    return { notFound: true };
  }

  return { props: await getArticle(slug) };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { getAllArticles } = await import('~/utils/mdx');
  const pages = await getAllArticles();

  const paths = pages.map(({ slug }) => ({ params: { slug } }));
  return { paths, fallback: false };
};

export default MarkdownPage;
