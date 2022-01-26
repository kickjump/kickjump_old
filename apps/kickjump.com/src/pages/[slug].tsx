import { type GetStaticPaths, type GetStaticProps } from 'next';

import { Layout } from '~/components/layout';
import { Mdx } from '~/components/mdx';
import { type MdxItem } from '~/utils/mdx';

interface MdxPageProps {
  page: MdxItem;
}

const MdxPage = (props: MdxPageProps) => {
  return <Layout>{props.page ? <Mdx {...props.page} /> : ''}</Layout>;
};

export const getStaticProps: GetStaticProps<MdxPageProps> = async ({ params }) => {
  const { getPage } = await import('~/utils/mdx');
  const { string } = await import('superstruct');
  const slug = params?.slug;

  if (!string().is(slug)) {
    return { notFound: true };
  }

  const page = await getPage(slug);

  return { props: { page } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { getAllPages } = await import('~/utils/mdx');
  const pages = await getAllPages();

  const paths = pages.map(({ slug }) => ({ params: { slug } }));
  return {
    paths,
    fallback: false,
  };
};

export default MdxPage;
