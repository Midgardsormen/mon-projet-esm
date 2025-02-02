<script lang="ts">
    import { FormInput, FormTextarea } from "yesvelte/form";
    import {Icon} from "yesvelte/icon";
    import { createTransaction } from './statics/transaction-creation.js';
    import { transactions } from '../../../stores/transactionsStore.js';
    import type { CreateTransactionDto } from "types/interfaces.js";
    import { categories } from '../../../stores/categoriesStore.js';
    import { onMount } from 'svelte';
    import CategorySelectorLayer from '../../categories/categories-selector/CategorySelectorLayer.svelte';
    import { fetchCategories } from '../../categories/categories-selector/categories-selector.js';
    
    let amount: number = 0;
    let type: 'income' | 'expense' = 'income';
    let categoryId: string = '';
    let categoryLabel: string = '';
    let description = '';
    let date = '';

    let showEnd = false;

    onMount(async () => {
        await fetchCategories();
    });

    async function handleSubmit() {
      const payload = { amount, type, category: categoryLabel, description, date };
      try {
          const response: CreateTransactionDto[] = await createTransaction(payload);

          // Mettre à jour le store après création
          transactions.update(current => {
                return [...current, response[0]]
            } );
          

          // Réinitialiser les champs
          amount = 0;
          type = 'income';
          categoryLabel = '';
          categoryId='';
          description = '';
          date = '';
      } catch (err) {
          console.error('Erreur lors de la création de la transaction :', err);
      }
    }

    function handleSelectCategory(e: CustomEvent<{ id: string; label: string }>) {
    categoryId = e.detail.id;
    categoryLabel = e.detail.label;
    // Éventuellement fermer l'offcanvas :
    showEnd = false;
  }

</script>

<form 
    on:submit|preventDefault={handleSubmit} 
    class="transaction-creation-form"
    class:is-income={type === 'income'}
    class:is-expense={type === 'expense'}
    >

    <p class="y-el y-label y-label-required">Type :</p>
    <div class="button-shape-radio-group y-el y-form-radio-group">
        <label class="button-shape-radio-group__label">
            <input type="radio" name="type" value="income" bind:group={type} required />
            <div 
            class="button-shape-radio-group__button y-el y-button"
            class:is-income={type === 'income'}
            class:is-expense={type === 'expense'}
            >
                <Icon name="arrow-up" />Revenu
            </div>
        </label>
        <label class="button-shape-radio-group__label">
            <input type="radio" name="type" value="expense" bind:group={type} required />
            <div 
            class="button-shape-radio-group__button y-el y-button"
            class:is-income={type === 'income'}
            class:is-expense={type === 'expense'}
            >
                <Icon name="arrow-down" />Dépense
            </div>
        </label>
    </div>

    <FormInput label="Montant :" placeholder="Entrez le montant..." type="number" required bind:value={amount} />
  
  
    <div>
        <label for="category">Catégorie :</label>
        <input id="category" readonly type="text" bind:value={categoryLabel} required />
        <button type="button"  on:click={() => (showEnd = !showEnd)}>
            Choisir une catégorie
          </button>
    </div>
  
    <FormTextarea label="Description (facultatif) :" placeholder="Entrez la description..." bind:value={description} />
  
    <div class="y-el y-form-date-picker">
        <label class="y-el y-label y-label-required" for="date">Date :</label>
        <input class="y-el y-date-picker" id="date" type="date" bind:value={date} required />
    </div>
  
    <button type="submit">Ajouter la transaction</button>
  </form>

<CategorySelectorLayer transactionType={type} showEnd={showEnd} on:selectCategory={handleSelectCategory} />



  <style lang="scss">
    .transaction-creation-form{
        padding: 1rem;
        &.is-income {
        background-color: #b0e8b6; /* vert clair ou la couleur de ton choix */
        }

        &.is-expense {
        background-color: #f4a9a9; /* rouge clair ou la couleur de ton choix */
        }
    }
    .button-shape-radio-group{
        display: flex;
        justify-content: space-between;
        gap:0.25rem;
        &__label{
            
            flex-grow: 1;
            & input {
                width: 0;
                height: 0;
                visibility: hidden;
                padding: 0;
                margin: 0;
                box-sizing: border-box;
                appearance: none;
                & + .button-shape-radio-group__button{
                    width: 100%;
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
        }
    }
  </style>