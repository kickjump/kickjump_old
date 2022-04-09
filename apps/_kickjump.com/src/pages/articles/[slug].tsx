import type { GetStaticPaths, GetStaticProps } from 'next';

import { Layout } from '~/components/layout';
import { Mdx } from '~/components/mdx';
import type { MdxItem } from '~/utils/mdx';

interface MdxPageProps {
  page: MdxItem;
}

const MdxPage = (props: MdxPageProps) => {
  return <Layout>{props.page ? <Mdx {...props.page} /> : ''}</Layout>;
};

export const getStaticProps: GetStaticProps<MdxPageProps> = async ({ params }) => {
  const { getArticle } = await import('~/utils/mdx');
  const { string } = await import('superstruct');
  const stringSchema = string();
  const slug = params?.slug;

  if (!stringSchema.is(slug)) {
    return { notFound: true };
  }

  return { props: { page: await getArticle(slug) } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { getAllArticles } = await import('~/utils/mdx');
  const pages = await getAllArticles();

  const paths = pages.map(({ slug }) => ({ params: { slug } }));
  return { paths, fallback: false };
};

export default MdxPage;
