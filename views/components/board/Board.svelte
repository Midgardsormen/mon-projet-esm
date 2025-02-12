<script lang="ts">
    import { Offcanvas, OffcanvasHeader, OffcanvasBody } from 'yesvelte/offcanvas';
    import { Button } from 'yesvelte/button';
    import TransactionCreationForm from "../transactions/transaction-creation-form/TransactionCreationForm.svelte";
    import TransactionListTable from "../transactions/transaction-list-table/TransactionListTable.svelte";
    import { Card, CardBody } from 'yesvelte/card';
    import { onMount } from 'svelte';
    import { totalBalance } from '../../stores/transactionsStore.js';
    import { fetchTotalBalance } from './statics/board.js';
    import LoginForm from '../auth/LoginForm.svelte';
    import LogoutButton from '../auth/LogoutButton.svelte';
    import { supabase } from "../../../libs/shared/src/client/supabase/supabase.js";

    export let dataForHydration;

    let showEnd = false;
    let displayedTotalBalance = dataForHydration?.totalBalance || [];
    let formRef: TransactionCreationForm;
    let isLoggedIn = false;

    $: if (!showEnd && formRef) {
        formRef.resetForm();
    }

          console.log('dataForHydration',  dataForHydration)
    onMount(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        isLoggedIn = !!session?.access_token; 

        if (!dataForHydration?.totalBalance) {
        const initialTotalBalance = await fetchTotalBalance();
        totalBalance.set(initialTotalBalance);
        console.log('displayedTotalBalance sans dataForHydration', initialTotalBalance)

        } else {
            totalBalance.set(displayedTotalBalance);
            console.log('displayedTotalBalance', $totalBalance)
    }});

  
</script>
<div class="board">
    <header class="board__header">
        <Card>
            <CardBody>
                <h1>{dataForHydration.message} {$totalBalance} €</h1>
                {#if isLoggedIn}
                    <LogoutButton />
                {:else}
                    <LoginForm />
                {/if}
                <Button color="primary" 
                on:click={() => {(showEnd = !showEnd); console.log('showEnd', showEnd)}}>Ajouter une entrée</Button>
            </CardBody>
        </Card>
    </header>
    <main class="board__main">
        <aside class="board__left-aside">
            <p class="board__date">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            {#if isLoggedIn}
                <p class="board__balance">Votre solde <span class="board__balance-amount">{$totalBalance} €</span> </p>
            {/if}
              
        </aside>
        <section class="board_container">
    
            <TransactionListTable dataForHydration={dataForHydration} />
        </section>
    </main>
    <Offcanvas placement="end" bind:show={showEnd} backdrop noScroll autoClose>
        <OffcanvasHeader title="Ajouter une entrée" />
        <OffcanvasBody>
            <TransactionCreationForm bind:this={formRef}  on:close={() => showEnd = false} />
        </OffcanvasBody>
        
    </Offcanvas>
    
</div>
<style lang=scss>
    .board{
        &__main{
          display: flex;
          padding: 0.5rem;  
        }
        
        &__left-aside{
            width: 15%;
            padding: 2rem 0.5rem;  
            text-align: center;
            background-color: #182433;
            color: #ffffff;
        }
        &__date{
            color: #ffffff;
            font-style: normal;
            border-bottom: 1px solid #ffffff;
            padding-bottom: 2rem;
            &::first-letter{
                text-transform: uppercase;
            }

        }
        &__balance{
            color: #ffffff;
            font-style: normal;

            &-amount{
                display: block;
                font-weight: bold;
                font-size: 2rem;
                color: #ffffff;

            }
        }
        &_container{
            flex-grow: 1;
            padding: 0.5rem;  
        }
    }
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