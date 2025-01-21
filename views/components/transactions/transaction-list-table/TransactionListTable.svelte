<script lang="ts">
  import { Card, CardBody } from 'yesvelte'
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
    padding: 0;
    &__line{
      margin-bottom: 1rem;
      &--expense{
        background-color:red
      }
      &--income{
        background-color:green
      }
    }
    
  }
  p {
      font-style: italic;
      color: #555;
  }
</style>
