<script lang="ts">
    import { Button } from 'yesvelte/button';
    import { Icon } from 'yesvelte/icon';
    import { deleteTransaction } from './statics/transaction-deletion.js';
    import { transactions } from '../../../stores/transactionsStore.js';

    export let idToDelete: string;

    async function handleDelete() {
    try {
      if (!idToDelete) return;
      await deleteTransaction(idToDelete);
      console.log(`Transaction avec l'id ${idToDelete} supprimée !`);
      // ici, tu peux éventuellement déclencher un rafraîchissement de ta liste,
      transactions.update((currentTransactions) => {
        return currentTransactions.filter((t) => t.id !== idToDelete);
      });
      console.log(transactions)
      // naviguer vers une autre page, ou afficher une notification.
    } catch (error) {
      console.error(error);
      // Gestion des erreurs : notification, message d’erreur, etc.
    }
  }
</script>

<Button color="danger" on:click={handleDelete}>
	<Icon name="trash" />
</Button>