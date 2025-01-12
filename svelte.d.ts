declare module '*.svelte' {
  import { SvelteComponent } from 'svelte';

  export default class extends SvelteComponent {
    constructor(options: {
      target: Element;
      anchor?: Element;
      hydrate?: boolean;
      intro?: boolean;
      props?: any;
      $$inline?: boolean;
    });
  }
}
