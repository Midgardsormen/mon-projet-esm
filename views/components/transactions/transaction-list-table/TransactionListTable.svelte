<script lang="ts">
  import { onDestroy } from 'svelte';
  import { transactions } from '../stores/transactionsStore';

  export let dataForHydration;
  
  let displayedTransactions = dataForHydration?.transactions || [];

  const unsubscribe = transactions.subscribe(storeTransactions => {
    if (storeTransactions && storeTransactions.length > 0) {
      displayedTransactions = storeTransactions;
    }
  });
  onDestroy(() => {
    unsubscribe();
  });

</script>

<ul>
  {#each displayedTransactions  as transaction (transaction.id)}
      <li>
          <strong>{transaction.type}</strong>: {transaction.amount} €
          <br />
          Catégorie: {transaction.category}
          <br />
          Description: {transaction.description || 'Aucune description'}
          <br />
          Date: {new Date(transaction.date).toLocaleDateString()}
      </li>
  {/each}
</ul>

<style>
  ul {
      list-style-type: none;
      padding: 0;
  }
  li {
      margin-bottom: 1rem;
      border-bottom: 1px solid #ccc;
      padding-bottom: 1rem;
  }
  p {
      font-style: italic;
      color: #555;
  }
</style>
