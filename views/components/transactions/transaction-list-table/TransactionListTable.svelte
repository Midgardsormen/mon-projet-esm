<script lang="ts">
	import CategoryListItem from './../../categories/categories-selector/CategoryListItem.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { groupedTransactions } from '../../../stores/transactionsStore.js';
  import { Card, CardBody } from 'yesvelte/card';
    import TransactionDeletionButton from '../transaction-deletion-button/TransactionDeletionButton.svelte';
    import { fetchGroupedTransactions } from './statics/TransactionListTable.js';
    import { Icon } from 'yesvelte/icon';

    import TransactionEditableLine from './transaction-editable-line/TransactionEditableLine.svelte';
    import { Button } from 'yesvelte/button';


  export let dataForHydration;

  let displayedGroupedTransactions = dataForHydration?.groupedTransactions?.groups || [];
  let editingTransactionId: string | null = null;
  let currentPage = 0;
  let limit = 10;
  let hasMore = true;

  onMount(async () => {
    if (!dataForHydration?.groupedTransactions) {
      const initialData = await fetchGroupedTransactions(currentPage, limit);
      groupedTransactions.set(initialData.groups);
    } else {
      groupedTransactions.set(displayedGroupedTransactions);
  }});

  // Mettre à jour l'affichage dès que le store change
  const unsubscribe = groupedTransactions.subscribe(storeData => {
    if (storeData && storeData.length > 0) {
      displayedGroupedTransactions = storeData;
      console.log('groupedTransactions', displayedGroupedTransactions);
    }
  });

  onDestroy(() => {
    unsubscribe();
  });

  const enterEditMode = (id: string) => {
      editingTransactionId = id;
  }

    // Fonction pour charger plus de données (pagination)
  const loadMore = async () => {
    // Incrémentez la page pour charger les éléments suivants
    currentPage += 1;
  
    // Récupérez la nouvelle page de données groupées
    const result = await fetchGroupedTransactions(currentPage, limit);
    hasMore = result.hasMore;

    // Mettez à jour le store groupedTransactions en ajoutant (et fusionnant) les nouveaux groupes
    groupedTransactions.update((current) => {
      // Créez une copie des groupes existants
      let updated = [...current];
    
      result.groups.forEach((newGroup) => {
        // Rechercher si un groupe avec le même mois/année existe déjà
        const index = updated.findIndex((group) => group.monthYear === newGroup.monthYear);
        
        if (index >= 0) {
          // Si le groupe existe déjà, concaténez les nouvelles transactions avec celles existantes
          updated[index] = {
            ...updated[index],
            transactions: [...updated[index].transactions, ...newGroup.transactions]
          };
        } else {
          // Sinon, ajoutez directement le nouveau groupe
          updated.push(newGroup);
        }
      });
    
    // Optionnel : triez les groupes par ordre décroissant selon la date de la première transaction de chaque groupe
      updated.sort((a, b) => {
        const dateA = new Date(a.transactions[0].date);
        const dateB = new Date(b.transactions[0].date);
        return dateB.getTime() - dateA.getTime();
      });
    
    return updated;
  });
};

</script>

<ul class="transaction-table">
  {#each displayedGroupedTransactions as group}
    <li class="transaction-group">
      <h2 class="transaction-group__header">{group.monthYear}</h2>
      <ul>
        {#each group.transactions  as transaction (transaction.id)}
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
    </li>
  {/each}
</ul>

{#if hasMore}
<div class="transaction-table__load-more">
  <Button outline color="dark"  on:click={loadMore}>
    <Icon name="circle-dashed-plus" /> Charger plus de transactions
  </Button>
</div>
{/if}

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
    &__load-more{
      display: flex;
      justify-content: center;
      padding: 0.5rem;
    }
    
  }
  p {
      font-style: italic;
      color: #555;
  }
</style>
