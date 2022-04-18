/// <reference types="@cloudflare/workers-types" />
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
  // interface Locals {}
  interface Platform {
    env: { COUNTER: DurableObjectNamespace };
    context: ExecutionContext;
  }
  interface Session {}
  // interface Stuff {}
}
