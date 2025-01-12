<script lang="ts">
  import { transactions } from '../stores/transactionsStore';
</script>

<ul>
  {#each $transactions as transaction (transaction.id)}
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
