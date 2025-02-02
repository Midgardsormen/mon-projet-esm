<script lang="ts">
    import { onMount } from 'svelte';
    import { transactions } from './stores/transactionsStore.js';
    import { categories } from './stores/categoriesStore.js';
    import Board from './components/board/Board.svelte';

    export let dataForHydration;
    
    onMount(() => {
    // Initialiser le store avec les transactions hydratées
    transactions.set(dataForHydration.transactions || []);
    categories.set(dataForHydration.categories || []);
  });
  </script>
  
  <main>
    <div id="app">
      <Board dataForHydration={dataForHydration}/>
    </div>
  </main>
  