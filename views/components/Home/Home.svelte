<script>
  import { createTransaction } from './api';

  export let dataForHydration;

  let transactions = dataForHydration.transactions || [];

  let amount = 0;
  let type = 'income'; // Valeur par défaut
  let category = '';
  let description = '';
  let date = '';

  // Variable pour tester la réactivité
  let dynamicText = '';



  async function handleSubmit() {
      const payload = { amount, type, category, description, date };
      try {
          const response = await createTransaction(payload);
          console.log('Transaction créée :', response);
          console.log('transactions avant :', transactions);

          transactions = [...transactions, response];
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

<ul>
  {#each transactions as transaction (transaction.id)}
      <li>
          <strong>{transaction.type}</strong>: {transaction.amount} €
          <br />
          Catégorie: {transaction.category}
          <br />
          Description: {transaction.description || 'Aucune description'}
          <br />
          Date: {new Date(transaction.date).toLocaleDateString()}
      </li>
  {/each}
</ul>

<!-- Section de test de réactivité -->
<div>
  <label for="dynamic-input">Test de réactivité :</label>
  <input
      id="dynamic-input"
      type="text"
      placeholder="Tapez quelque chose"
      bind:value={dynamicText}
  />
  <p>Vous avez écrit : "{dynamicText || 'rien'}"</p>
</div>

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

<style>
  ul {
      list-style-type: none;
      padding: 0;
  }
  li {
      margin-bottom: 1rem;
      border-bottom: 1px solid #ccc;
      padding-bottom: 1rem;
  }
  #dynamic-input {
      margin-top: 1rem;
      display: block;
  }
  p {
      font-style: italic;
      color: #555;
  }
</style>
