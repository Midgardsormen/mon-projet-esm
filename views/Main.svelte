<script lang="ts">
    import { onMount } from 'svelte';
    import { transactions } from './components/transactions/stores/transactionsStore.js';
    import Board from './components/board/Board.svelte';

    export let dataForHydration;
    
    onMount(() => {
    // Initialiser le store avec les transactions hydratées
    transactions.set(dataForHydration.transactions || []);

  });
  </script>
  
  <main>
    <h1>{dataForHydration.message}</h1>
    <div id="app">
      <Board dataForHydration={dataForHydration}/>
    </div>
  </main>
  