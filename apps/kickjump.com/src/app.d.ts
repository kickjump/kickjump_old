/// <reference types="@cloudflare/workers-types" />
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
  interface Stuff {
    title?: string;
    noindex?: boolean;
    nofollow?: boolean;
    description?: string;
    keywords?: string;
    canonical?: string;
    openGraph?: import('svelte-seo/types/SvelteSeo').OpenGraph;
    twitter?: import('svelte-seo/types/SvelteSeo').Twitter;
    /**
     * @default true
     */
    animateTransition?: boolean;
  }

  interface Locals {
    /**
     * True for responses with 4xx and 5xx status codes.
     */
    error: boolean;
  }

  interface Platform {
    env: { COUNTER: DurableObjectNamespace };
    context: ExecutionContext;
  }
  interface User {
    /**
     * The user id.
     */
    id: string;
    /**
     * The name of the user which is retrieved from their GitHub profile when
     * signing up.
     */
    name: string | null | undefined;
    /**
     * The primary email address for this user. Only verified email address can
     * be set as primary.
     */
    email: string | null | undefined;

    /**
     * A profile image url if one exists.
     */
    image: string | null | undefined;
  }

  interface Session {
    env: {
      PUBLIC_WEB3_AUTH_CLIENT_ID: string;
    };
    /**
     * The provider which was used to login.
     */
    provider: string;

    /**
     * Whether an error occurred during session request.
     */
    error: boolean;

    /**
     * The preferred language.
     *
     * @default 'en'
     */
    preferredLanguage: string;

    /**
     * The accepted languages in case the preferred language doesn't have a translation.
     */
    acceptedLanguages: string[];

    /**
     * The user agent string provided by the request. This is useful to deciding
     * whether the device is mobile or desktop.
     */
    userAgent: string;

    /**
     * The absolute url of the request.
     */
    absoluteUrl: string;
  }
}

namespace NodeJS {
  interface ProcessEnv {
    WEBSITE_URL: string;
    SESSION_SECRET: string;
    SOLANA_RPC_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    GITHUB_APP_ID: string;
    GITHUB_APP_PRIVATE_KEY: string;
    DATABASE_URL: string;
    VITE_WEB3_AUTH_CLIENT_ID: string;
    WEB3_AUTH_CLIENT_SECRET: string;
  }
}

interface ImportMetaEnv extends NodeJS.ProcessEnv {}

declare module '@sveltejs/kit/vite' {
  import { Plugin } from 'vite';
  export function sveltekit(): Plugin[];
}
