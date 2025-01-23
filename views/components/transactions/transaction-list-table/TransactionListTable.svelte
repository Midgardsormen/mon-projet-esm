<script lang="ts">
  import { onDestroy } from 'svelte';
  import { transactions } from '../stores/transactionsStore.js';
    import { Card, CardBody } from 'yesvelte/card';

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

<ul class="transaction-table">
  {#each displayedTransactions  as transaction (transaction.id)}
      <li class="transaction-table__line transaction-table__line--{transaction.type}">
        <Card>
          <CardBody>
            <p class="transaction-table__item transaction-table__amount">{transaction.type==="expense" ? "-":"+"} {transaction.amount} €</p>
            <div class="transaction-table__items">
              <p class="transaction-table__item transaction-table__category">{transaction.category}</p>
              <p class="transaction-table__item transaction-table__description">{transaction.description || 'Aucune description'}</p>
              <p class="transaction-table__item transaction-table__date">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </CardBody>
        </Card>
      </li>
  {/each}
</ul>

<style lang="scss">
  .transaction-table{
    list-style-type: none;
    padding: 1rem;
    &__line{
      margin-bottom: 1rem;
      &--expense{
        background-color:rgba(214, 57, 57, 0.25)
      }
      &--income{
        background-color:rgba(47, 179, 68, 0.25)
      }
      :global(.y-card) {
        background-color: transparent;
      }
    }
    &__amount{
      font-weight: bold;
      font-size: 1.25rem;
    }
    &__items{
      display: flex;
      gap: 0.25rem;
      justify-content: space-between;
    }
    
  }
  p {
      font-style: italic;
      color: #555;
  }
</style>
