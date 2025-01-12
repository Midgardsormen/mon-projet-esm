<script lang="ts">
    import Board from './components/board/Board.svelte';
    import { onMount } from 'svelte';
    import { transactions } from './components/transactions/stores/transactionsStore';

    export let dataForHydration;
    onMount(() => {
    // Initialiser le store avec les transactions hydratées
    transactions.set(dataForHydration.transactions || []);

  });
    console.log('++++++++++++++++', dataForHydration)
  </script>
  
  <main>
    <h1>{dataForHydration.message}</h1>
    <div id="app">
      <Board />
    </div>
  </main>
  