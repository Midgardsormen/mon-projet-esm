// views/client-main.js
import Home from '../Home.svelte';

window.addEventListener('DOMContentLoaded', () => {
  // On initie ici la partie hydratation
  const target = document.getElementById('home_component');
  if (target) {
    new Home({
      target,
      hydrate: true,
      props: {
        dataForHydration: window.home_component, // passage correct des props
      },
    });
  }
});
