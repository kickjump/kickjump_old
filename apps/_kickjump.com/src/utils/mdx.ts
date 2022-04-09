import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import fs from 'node:fs/promises';
import path from 'node:path';

type MdxType = 'page' | 'article';

export interface FrontmatterData {
  [key: string]: any;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  authors?: string[];
  published?: boolean;
  layout?: MdxType;
}

function getPath(type: MdxType, ...paths: string[]) {
  return path.join(process.cwd(), 'src', 'mdx', `${type}s`, ...paths);
}

interface GetFileProps {
  type: MdxType;
  filename: string;
}

/**
 * Load an article or a page.
 */
async function getFile(props: GetFileProps): Promise<string> {
  const { filename, type } = props;
  const filePath = getPath(type, filename);

  return fs.readFile(filePath, { encoding: 'utf8' });
}

interface MdxListItem {
  frontmatter: FrontmatterData;
  slug: string;
}

async function getAllItems(type: MdxType): Promise<MdxListItem[]> {
  const filenames = await fs.readdir(getPath(type));
  const items: MdxListItem[] = [];
  const promises: Array<Promise<void>> = [];

  for (const filename of filenames) {
    if (!/\.mdx?$/.test(filename)) {
      continue;
    }

    const promise = getFile({ filename, type }).then((source) => {
      const slug = filename.replace(/\.mdx?$/, '');
      const { data: frontmatter } = matter(source);

      if (frontmatter.published) {
        items.push({ frontmatter, slug });
      }
    });

    promises.push(promise);
  }

  await Promise.all(promises);
  return items;
}

export interface MdxItem {
  frontmatter: FrontmatterData;
  code: string;
}

async function getItem(type: MdxType, slug: string): Promise<MdxItem> {
  const source = await getFile({ filename: `${slug}.mdx`, type });
  const { code, frontmatter } = await bundleMDX({ source, cwd: getPath(type) });

  return { frontmatter, code };
}

export function getPage(slug: string): Promise<MdxItem> {
  return getItem('page', slug);
}

export function getArticle(slug: string): Promise<MdxItem> {
  return getItem('article', slug);
}

export function getAllArticles(): Promise<MdxListItem[]> {
  return getAllItems('article');
}

export function getAllPages(): Promise<MdxListItem[]> {
  return getAllItems('page');
}
