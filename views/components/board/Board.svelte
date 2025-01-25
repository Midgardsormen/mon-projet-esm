<script lang="ts">
    import { Offcanvas, OffcanvasHeader, OffcanvasBody } from 'yesvelte/offcanvas';
    import { Button } from 'yesvelte/button';
    import TransactionCreationForm from "../transactions/transaction-creation-form/TransactionCreationForm.svelte";
    import TransactionListTable from "../transactions/transaction-list-table/TransactionListTable.svelte";

    export let dataForHydration;
    let showEnd = false;
</script>
<div>
    <Button color="primary" on:click={() => (showEnd = !showEnd)}>Ajouter une entrée</Button>
    <TransactionListTable dataForHydration={dataForHydration} />
    <Offcanvas placement="end" bind:show={showEnd} backdrop noScroll autoClose>
        <OffcanvasHeader title="Ajouter une entrée" />
        <OffcanvasBody>
            <TransactionCreationForm />
        </OffcanvasBody>
        
    </Offcanvas>
    
</div>
<style lang=scss>

</style>