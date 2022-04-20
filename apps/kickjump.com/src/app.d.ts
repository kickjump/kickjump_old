/// <reference types="@cloudflare/workers-types" />
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
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
  interface Session {
    user: {
      /**
       * The user id.
       */
      id: string;
      /**
       * The name of the user which is retrieved from their GitHub profile when
       * signing up.
       */
      name: string | null;
      /**
       * The primary email address for this user. Only verified email address can
       * be set as primary.
       */
      primaryEmail: string | null;
      /**
       * A profile image url if one exists.
       */
      image: string | null;
    };
    /**
     * The provider which was used to login.
     */
    provider: string;

    /**
     * Whether an error occurred during session request.
     */
    error: boolean;
  }

  interface Stuff {}
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
  }
}
interface ImportMetaEnv extends NodeJS.ProcessEnv {}
