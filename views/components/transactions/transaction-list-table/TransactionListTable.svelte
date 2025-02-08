<script lang="ts">
	import CategoryListItem from './../../categories/categories-selector/CategoryListItem.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { transactions } from '../../../stores/transactionsStore.js';
  import { Card, CardBody } from 'yesvelte/card';
    import TransactionDeletionButton from '../transaction-deletion-button/TransactionDeletionButton.svelte';
    import { fetchTransactions } from './statics/TransactionListTable.js';
    import { Icon } from 'yesvelte/icon';

    import TransactionEditableLine from './transaction-editable-line/TransactionEditableLine.svelte';
    import { Button } from 'yesvelte/button';
    import { Badge } from 'yesvelte/badge';


  export let dataForHydration;
  
  let displayedTransactions = dataForHydration?.transactions || [];
  let editingTransactionId: string | null = null;

 

  onMount(async () => {
    // Si on n’a pas reçu dataForHydration, on récupère les données par fetch
    if (!dataForHydration?.transactions) {
      displayedTransactions = await fetchTransactions();
      console.log(displayedTransactions)
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
      <li class="transaction-table__line ">
        <Card>
          <CardBody>
            <div class="transaction-table__header transaction-table__header--{transaction.type}">
            <p class="transaction-table__item transaction-table__amount transaction-table__amount--{transaction.type}">{transaction.type==="expense" ? "-":"+"} {transaction.amount} €</p>
            <div class="transaction-table__buttons">
              <TransactionDeletionButton idToDelete={transaction.id}/>
              <Button outline color="dark"  on:click={() => enterEditMode(transaction.id)}>
                <Icon name="edit" />
              </Button>
            </div>
            </div>
            <div class="transaction-table__items">
              <p class="transaction-table__item transaction-table__category">
                {#if transaction.category}
                <CategoryListItem 
                  label={transaction.category.name}
                  id={transaction.category.id}
                  iconLabel={transaction.category.icon_label}
                  iconColor={transaction.category.icon_color}
                  size={"s"}
                />
                {/if}
              </p>
              <p class="transaction-table__item transaction-table__description">{transaction.description || 'Aucune description'}</p>
              <p class="transaction-table__item transaction-table__date">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </CardBody>
        </Card>

      </li>
    {/if}
  {/each}
</ul>

<style lang="scss" global>
  .transaction-table{
    list-style-type: none;
    padding: 0;
    &__header{
      display: flex;
      margin-bottom: 1rem;
      padding: 0.25rem 0.5rem;
      &--expense{
        background-color:rgba(214, 57, 57, 0.125)
      }
      &--income{
        background-color:rgba(47, 179, 68, 0.125)
      }

    }
    &__amount{
      flex-grow:1 ;
      font-weight: bold;
      font-size: 1.5rem;
      &--expense{
        color: rgb(214, 57, 57);
      }
      &--income{
        color: rgb(41, 102, 51);
      }
    }
    &__buttons{
      display: flex;
      gap: 0.25rem;
      align-self: center; 
      button{
        border-radius: 50%;
      }
    }
    &__line{
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      gap: 0.5rem;
      :global(.y-card) {
        flex-grow: 1;
        background-color: transparent;
      }
      :global(.y-card-body) {
        padding: 0.5rem 0.75rem;
      }
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
