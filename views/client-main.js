import Main from './Main.svelte';

window.addEventListener('DOMContentLoaded', () => {
  // On initie ici la partie hydratation
  const target = document.getElementById('main_component');
  if (target) {
    new Main({
      target,
      hydrate: true,
      props: {
        dataForHydration: window.main_component,
      },
    });
  }
});
