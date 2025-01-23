<script lang="ts">
    import TransactionCreationForm from "../transactions/transaction-creation-form/TransactionCreationForm.svelte";
    import TransactionListTable from "../transactions/transaction-list-table/TransactionListTable.svelte";

    export let dataForHydration;
</script>
<div>
    <TransactionListTable dataForHydration={dataForHydration} />
    <TransactionCreationForm />
</div>