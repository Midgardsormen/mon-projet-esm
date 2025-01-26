<script lang="ts">
    import type { CreateTransactionDto } from 'types/interfaces.js';
    export let transactionLineData: CreateTransactionDto;

    let {id, amount, type, category, description, date }  = transactionLineData;

    async function handleSubmit() {
     console.log('*****', amount) 
    }

</script>

<form  on:submit|preventDefault={handleSubmit}>
    <p class="transaction-table__item transaction-table__amount">
      {type==="expense" ? "-":"+"} <input type="number" data-transaction-id={id} data-name="amount" bind:value={amount}/>  €
    </p>
    <div class="transaction-table__items">
      <p class="transaction-table__item transaction-table__category">{category}</p>
      <p class="transaction-table__item transaction-table__description">{description || 'Aucune description'}</p>
      <p class="transaction-table__item transaction-table__date">{new Date(date).toLocaleDateString()}</p>
    </div>
    <button type="submit">submit</button>
</form>