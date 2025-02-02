<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { transactions } from '../../../stores/transactionsStore.js';
  import { Card, CardBody } from 'yesvelte/card';
    import TransactionDeletionButton from '../transaction-deletion-button/TransactionDeletionButton.svelte';
    import { fetchTransactions } from './statics/TransactionListTable.js';
    import { Icon } from 'yesvelte/icon';

    import TransactionEditableLine from './transaction-editable-line/TransactionEditableLine.svelte';
    import { Button } from 'yesvelte/button';

  export let dataForHydration;
  
  let displayedTransactions = dataForHydration?.transactions || [];
  let editingTransactionId: string | null = null;

 

  onMount(async () => {
    // Si on n’a pas reçu dataForHydration, on récupère les données par fetch
    if (!dataForHydration?.transactions) {
      displayedTransactions = await fetchTransactions();
    }
  });

  const unsubscribe = transactions.subscribe(storeTransactions => {
    if (storeTransactions && storeTransactions.length > 0) {
      displayedTransactions = storeTransactions;
    }
  });

  onDestroy(() => {
    unsubscribe();
  });

  const enterEditMode = (id: string) => {
      editingTransactionId = id;
  }




</script>

<ul class="transaction-table">
  {#each displayedTransactions  as transaction (transaction.id)}
    {#if editingTransactionId === transaction.id}
      <TransactionEditableLine transactionLineData={transaction} on:editDone={() => editingTransactionId = null}/>
    {:else}
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
        <div class="transaction-table__buttons">
          <TransactionDeletionButton idToDelete={transaction.id}/>
          <Button  on:click={() => enterEditMode(transaction.id)}>
            <Icon name="edit" />
          </Button>
        </div>
      </li>
    {/if}
  {/each}
</ul>

<style lang="scss" global>
  .transaction-table{
    list-style-type: none;
    padding: 0;
    &__line{
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      gap: 0.5rem;
      &--expense{
        background-color:rgba(214, 57, 57, 0.25)
      }
      &--income{
        background-color:rgba(47, 179, 68, 0.25)
      }
      :global(.y-card) {
        flex-grow: 1;
        background-color: transparent;
      }
      :global(.y-card-body) {
        padding: 0.5rem 0.75rem;
      }
    }
    &__buttons{
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    &__amount{
      font-weight: bold;
      font-size: 1.25rem;
    }
    &__items{
      display: flex;
      gap: 1rem;
      justify-content: space-between;
    }
    &__item{
      margin-bottom: 0.25rem;
    }
    &__category{
      flex-grow: 0;
      width: 20%;
      text-overflow: ellipsis;
    }
    &__description{
      flex-grow:1;
      font-style: normal;
    }
    &__date{
      flex-grow: 0;
      width: 5rem;
      text-align: right;
    }
    
  }
  p {
      font-style: italic;
      color: #555;
  }
</style>
