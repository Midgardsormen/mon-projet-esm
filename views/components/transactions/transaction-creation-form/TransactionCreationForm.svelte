<script lang="ts">
    import { FormInput, FormTextarea } from "yesvelte/form";
    import {Icon} from "yesvelte/icon";
    import { Button } from 'yesvelte/button'
    import { createTransaction } from './statics/transaction-creation.js';
    import { transactions } from '../stores/transactionsStore.js';
    
    let id: string ='';
    let amount: number = 0;
    let type: 'income' | 'expense' = 'income';
    let category = '';
    let description = '';
    let date = '';

    async function handleSubmit() {
      const payload = { amount, type, category, description, date };
      try {
          const response = await createTransaction(payload);
          console.log('Transaction créée :', response);
          console.log('transactions avant :', transactions);

          // Mettre à jour le store après création
          transactions.update(current => [...current, response]);
          console.log('transactions après :', transactions);

          // Réinitialiser les champs
          amount = 0;
          type = 'income';
          category = '';
          description = '';
          date = '';
      } catch (err) {
          console.error('Erreur lors de la création de la transaction :', err);
      }
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
        <input id="category" type="text" bind:value={category} required />
    </div>
  
    <FormTextarea label="Description (facultatif) :" placeholder="Entrez la description..." bind:value={description} />
  
    <div class="y-el y-form-date-picker">
        <label class="y-el y-label y-label-required" for="date">Date :</label>
        <input class="y-el y-date-picker" id="date" type="date" bind:value={date} required />
    </div>
  
    <button type="submit">Ajouter la transaction</button>
  </form>

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