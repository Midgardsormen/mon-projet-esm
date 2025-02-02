<script lang="ts">
    import { Offcanvas, OffcanvasHeader, OffcanvasBody } from 'yesvelte/offcanvas';
    import { Button } from 'yesvelte/button';
    import TransactionCreationForm from "../transactions/transaction-creation-form/TransactionCreationForm.svelte";
    import TransactionListTable from "../transactions/transaction-list-table/TransactionListTable.svelte";
    import { Card, CardBody } from 'yesvelte/card';

    export let dataForHydration;
    let showEnd = false;
</script>
<div class="board">
    <div class="container">
        <header>
            <Card>
                <CardBody>
                    <h1>{dataForHydration.message}</h1>
                    <Button color="primary" on:click={() => (showEnd = !showEnd)}>Ajouter une entrée</Button>
                </CardBody>
            </Card>
        </header>
        <TransactionListTable dataForHydration={dataForHydration} />
    </div>
    <Offcanvas placement="end" bind:show={showEnd} backdrop noScroll autoClose>
        <OffcanvasHeader title="Ajouter une entrée" />
        <OffcanvasBody>
            <TransactionCreationForm />
        </OffcanvasBody>
        
    </Offcanvas>
    
</div>
<style lang=scss>
    .container{
        width: 100%;
        max-width: 1280px;
        margin:0 auto;
        padding: 1rem;
    }
    header{
        margin-bottom: 1rem;
        :global(.y-card-body){
            display: flex;
            justify-content: space-between;
            width: 100%;
        }
    }
</style>