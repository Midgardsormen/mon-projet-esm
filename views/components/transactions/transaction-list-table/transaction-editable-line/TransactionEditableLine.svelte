<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { CreateTransactionDto } from 'types/interfaces.js';
    import { Icon } from 'yesvelte/icon';
    import { updateTransaction } from '../statics/TransactionListTable.js';
    import { transactions } from '../../../../stores/transactionsStore.js';
    import { Card, CardBody } from 'yesvelte/card';
    export let transactionLineData: CreateTransactionDto;

    let {id, amount, type, category, description, date }  = transactionLineData;

    const dispatch = createEventDispatcher();
    async function handleSubmit() {
      const payload = { amount, type, category, description, date };
      const [updatedTransaction]: CreateTransactionDto[] = await updateTransaction(id as string, payload);

      transactions.update((currentTransactions) => {
        return currentTransactions.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        );
      });

      dispatch('editDone');
    }

</script>
<li class="">
  <form  on:submit|preventDefault={handleSubmit} class="transaction-table__line transaction-table__line--{type} transaction-table__editable-form" >
  <Card>
    <CardBody>
      <div class="transaction-table__item transaction-table__amount">
        <div class="transaction-table__items">
          <div class="button-shape-radio-group y-el y-form-radio-group">
            <label class="button-shape-radio-group__label" aria-label="Revenu">
                <input type="radio" name="type" value="income" bind:group={type} required />
                <div 
                class="button-shape-radio-group__button y-el y-button"
                class:is-income={type === 'income'}
                class:is-expense={type === 'expense'}
                >
                    <Icon name="plus"  title="Revenu" />
                </div>
            </label>
            <label class="button-shape-radio-group__label">
                <input type="radio" name="type" value="expense" bind:group={type} required />
                <div 
                class="button-shape-radio-group__button y-el y-button"
                class:is-income={type === 'income'}
                class:is-expense={type === 'expense'} 
                aria-label="Dépense"
                >
                    <Icon name="minus" title="Dépense" />
                </div>
            </label>
          </div> 
          <input type="number" data-transaction-id={id} data-name="amount" bind:value={amount}/>  €
        </div>
      </div>
      <div class="transaction-table__items">
        <p class="transaction-table__item transaction-table__category">
          <input type="text" data-transaction-id={id} data-name="category" bind:value={category}/></p>
        <p class="transaction-table__item transaction-table__description">
          <textarea data-transaction-id={id} data-name="category" bind:value={description}/>
        </p>
        <p class="transaction-table__item transaction-table__date">
          <input class="y-el y-date-picker" id="date" type="date" bind:value={date} />
      </div>
    </CardBody>
  </Card>
    <div class="transaction-table__buttons">
      <button
      class="transaction-table__submit-button y-el y-button y-button-icon"
      class:is-income={type === 'income'}
      class:is-expense={type === 'expense'}
      type="submit" color="secondary">
        <Icon name="check" />
      </button>
    </div>
</form>
</li>

<style lang="scss">
  .transaction-table{
    &__amount{
      display: flex;
      gap: 0.5rem;
      align-items: center;
      justify-content: space-between;
      & input[type="number"]{
        font-weight: bold;
      }
    }
    &__items{
      align-items:flex-end;
    }
    &__item{
      display: flex;
      input, textarea{
        background: none;
        border: none;
        border-bottom: 1px solid #555;
        font-style: italic;
        color: #555;
        max-width: 100%;
        margin-bottom: 0;
      }
      textarea{
        width: 100%;
      }
      input[type="radio"]{
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
        & + .button-shape-radio-group__button{
            padding: 0.25rem 0.25rem;
            background-color: rgb(238, 238, 238);
        }
        &:checked + .button-shape-radio-group__button{
            &.is-income{
                background-color: rgba(47, 179, 68, 0.75);
                color: #ffffff;
            }
            &.is-expense{
                background-color: rgba(214, 57, 57, 0.75);
                color: #ffffff;
            }                
        }
      }
      :global(.y-form-radio-group){
        margin-bottom: 0!important;
      }
    }
    &__submit-button{
      &.is-income{
          background-color: rgba(47, 179, 68, 0.75);
          color: #ffffff;
      }
      &.is-expense{
          background-color: rgba(214, 57, 57, 0.75);
          color: #ffffff;
      }  
    }
  }
</style>