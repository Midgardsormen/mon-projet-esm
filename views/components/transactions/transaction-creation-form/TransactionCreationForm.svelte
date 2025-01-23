<script lang="ts">
    import { createTransaction } from './statics/api.js';
    import { transactions } from '../stores/transactionsStore.js';

    let amount = 0;
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

<form on:submit|preventDefault={handleSubmit}>
    <div>
        <label for="amount">Montant :</label>
        <input id="amount" type="number" bind:value={amount} required />
    </div>
  
    <div>
        <label for="type">Type :</label>
        <select id="type" bind:value={type} required>
            <option value="income">Revenu</option>
            <option value="expense">Dépense</option>
        </select>
    </div>
  
    <div>
        <label for="category">Catégorie :</label>
        <input id="category" type="text" bind:value={category} required />
    </div>
  
    <div>
        <label for="description">Description (facultatif) :</label>
        <textarea id="description" bind:value={description}></textarea>
    </div>
  
    <div>
        <label for="date">Date :</label>
        <input id="date" type="date" bind:value={date} required />
    </div>
  
    <button type="submit">Ajouter la transaction</button>
  </form>