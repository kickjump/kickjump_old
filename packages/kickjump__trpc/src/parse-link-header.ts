import camelCase from 'just-camel-case';

export function parseLinkHeader(linkHeader: string | null | undefined): Links {
  const links: Links = Object.create(null);

  if (!linkHeader) {
    return links;
  }

  for (const header of linkHeader.split(HEADER_SPLIT_REGEX)) {
    const link = parseLink(header);

    if (!link || !link.rel) {
      continue;
    }

    links[link.rel] = link;
  }

  return links;
}

const HEADER_SPLIT_REGEX = /,\s*</;
const PARSE_LINK_REGEX = /<?(?<linkUrl>[^>]*)>(?<variables>.*)/;
const KEY_VALUE_REGEX = /\s*(?<key>.+)\s*=\s*"?(?<value>[^"]+)"?/;

function parseLink(header: string) {
  const match = header.match(PARSE_LINK_REGEX);

  if (!match) {
    return;
  }

  const { linkUrl = '', variables = '' } = match.groups ?? {};
  const [, ...parts] = variables.split(';');
  let url: URL;

  try {
    url = new URL(linkUrl);
  } catch {
    return;
  }

  const link: Link = Object.create(null);

  for (const part of parts) {
    const match = part.match(KEY_VALUE_REGEX);

    if (!match || !match.groups?.key || typeof match.groups.value !== 'string') {
      continue;
    }

    link[match.groups.key] = match.groups.value;
  }

  for (const [key, value] of url.searchParams) {
    const camelKey = camelCase(key);

    if (camelKey === 'page' || camelKey === 'perPage') {
      link[camelKey] = +value;
    } else {
      link[camelKey] = value;
    }
  }

  return link;
}

export type Link = {
  url: string;
  rel: string;
  page?: number;
  perPage?: number;
} & Record<string, string>;

export interface Links {
  next?: Link | undefined;
  prev?: Link | undefined;
  last?: Link | undefined;
  [rel: string]: Link | undefined;
}
