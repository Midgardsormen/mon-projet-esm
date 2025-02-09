<script lang="ts">
    import { FormInput, FormTextarea } from "yesvelte/form";
    import {Icon} from "yesvelte/icon";
    import { createTransaction } from './statics/transaction-creation.js';
    import { groupedTransactions } from '../../../stores/transactionsStore.js';
    import type { CategoryWithChildren, CreateTransactionDto, Transaction } from "types/interfaces.js";
    import { createEventDispatcher, onMount } from 'svelte';
    import CategorySelectorLayer from '../../categories/categories-selector/CategorySelectorLayer.svelte';
    import { fetchCategories, fetchCategoryById } from '../../categories/categories-selector/categories-selector.js';
    
    let amount: number;
    let type: 'income' | 'expense' = 'income';
    let category_id: string = '';
    let category_label: string = '';
    let description = '';
    let date = new Date().toLocaleDateString('fr-FR');
    let showCategories = false;

    const dispatch = createEventDispatcher();

    onMount(async () => {
        await fetchCategories();
    });

    async function handleSubmit() {
      const payload = { amount, type, category_id, description, date };
      try {
          const response: CreateTransactionDto[] = await createTransaction(payload);
          const category: CategoryWithChildren | null = await fetchCategoryById(category_id);
          const newTransaction: Transaction = { ...response[0], category } as Transaction;
          // Mettre à jour le store après création
          groupedTransactions.update(groups => {
                // Calculer la clé du groupe pour la nouvelle transaction
                const txDate = new Date(newTransaction.date);
                const monthName = txDate.toLocaleString('fr-FR', { month: 'long' });
                const year = txDate.getFullYear();
                const groupKey = `${monthName} ${year}`;

                // Chercher le groupe correspondant
                const groupIndex = groups.findIndex(g => g.monthYear === groupKey);
                if (groupIndex !== -1) {
                groups[groupIndex].transactions.push(newTransaction);
                } else {
                groups.push({ monthYear: groupKey, transactions: [newTransaction] });
                }
                // Optionnel : trier les groupes et les transactions
                groups.forEach(g => {
                g.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                });
                groups.sort((a, b) => {
                const dateA = new Date(a.transactions[0].date);
                const dateB = new Date(b.transactions[0].date);
                return dateB.getTime() - dateA.getTime();
                });
                return groups;
            });
          

          // Réinitialiser les champs
          resetForm();

          dispatch('close');
          
      } catch (err) {
          console.error('Erreur lors de la création de la transaction :', err);
      }
    }
    export function resetForm() {
        amount = 0;
        type = 'income';
        category_id = '';
        category_label = '';
        description = '';
        date = new Date().toLocaleDateString('fr-FR');
        showCategories = false;
    }

    function handleSelectCategory(e:CustomEvent<{id:string, label:string }>) {
        category_id = e.detail.id;
        category_label = e.detail.label;
        showCategories = false;
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
            <input 
            type="radio"
             name="type"
              value="income" 
              bind:group={type} 
              required 
              on:change={() => {
                category_id = '';
                category_label = '';
              }}
              />
            <div 
            class="button-shape-radio-group__button y-el y-button"
            class:is-income={type === 'income'}
            class:is-expense={type === 'expense'}
            >
                <Icon name="arrow-up" />Revenu
            </div>
        </label>
        <label class="button-shape-radio-group__label">
            <input 
            type="radio" 
            name="type" 
            value="expense" 
            bind:group={type} 
            required 
            on:change={() => {
                category_id = '';
                category_label = '';
              }}
            />
            <div 
            class="button-shape-radio-group__button y-el y-button"
            class:is-income={type === 'income'}
            class:is-expense={type === 'expense'}
            >
                <Icon name="arrow-down" />Dépense
            </div>
        </label>
    </div>
    <div class="y-el y-form-input">
        <p class="y-el y-label y-label-required">Montant :</p>
        <input type="number" step="0.01" data-name="amount" bind:value={amount} required placeholder="Entrez le montant..."/>  €
    </div>
  
    <div class="y-el y-form-input">
        <label class="y-el y-label y-label-required" for="category">Catégorie :</label>
        <input type="hidden" bind:value={category_id} />
        <div class="transaction-creation-form__category-flex-line">
            <button 
            class="transaction-creation-form__category-button y-el y-button y-button-size-md"
            class:y-button-color-green={type === 'income'}
            class:y-button-color-red={type === 'expense'} 
            type="button"  
            on:click={() => { (showCategories = !showCategories) }}> Choisir une catégorie </button>
            <input id="category" type="text" bind:value={category_label} required  placeholder="Choisissez la catégorie..."/>
        </div>
    </div>
  
    <FormTextarea label="Description (facultatif) :" placeholder="Entrez la description..." bind:value={description} />
  
    <div class="y-el y-form-date-picker">
        <label class="y-el y-label y-label-required" for="date">Date :</label>
        <input class="y-el y-date-picker" id="date" type="date" bind:value={date} />
    </div>
    <div class="transaction-creation-form__submit-line">
        <button 
        class="y-el y-button y-button-color-primary y-button-color-dark y-button-size-md"
        type="submit">Ajouter la transaction</button>
    </div>
  </form>

<CategorySelectorLayer 
    transactionType={type} 
    showCategories={showCategories} 
    on:selectCategory={handleSelectCategory} 
    on:closeCategoryLayer={() => showCategories = false} 
/>



  <style lang="scss">
    .transaction-creation-form{
        padding: 1rem;
        &.is-income {
        background-color: #b0e8b6; /* vert clair ou la couleur de ton choix */
        }

        &.is-expense {
        background-color: #f4a9a9; /* rouge clair ou la couleur de ton choix */
        }
        &__category-flex-line{
            #category{
                pointer-events: none;
                
                width: 100%;
            }
        }
        &__category-button{
            margin-bottom: 0.5rem;
        }
        &__submit-line{
            display: flex;
            justify-content: flex-end;
        }
    }
    .button-shape-radio-group{
        display: flex;
        justify-content: space-between;
        gap:0.25rem;
        &__label{
            display: flex;
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