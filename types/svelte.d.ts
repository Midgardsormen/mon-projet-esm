declare module '*.svelte' {
  import { SvelteComponent, type ComponentConstructorOptions } from 'svelte';

  export default class extends SvelteComponent {
    constructor(options: ComponentConstructorOptions<any>);
  }
}
