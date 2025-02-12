<script lang="ts">
    import { Button } from 'yesvelte/button';
    import { Icon } from 'yesvelte/icon';
    import { deleteTransaction } from './statics/transaction-deletion.js';
    import { groupedTransactions, totalBalance } from '../../../stores/transactionsStore.js';

    export let idToDelete: string;

    async function handleDelete() {
    try {
      if (!idToDelete) return;
      const removedTransaction = await deleteTransaction(idToDelete);
      console.log(`Transaction avec l'id ${idToDelete} supprimée !`);
      // ici, tu peux éventuellement déclencher un rafraîchissement de ta liste,
      groupedTransactions.update(groups => {
        // Pour chaque groupe, on filtre la transaction supprimée
        let updatedGroups = groups.map(group => {
          return { ...group, transactions: group.transactions.filter(t => t.id !== idToDelete) };
        });
        // Optionnel : retirer les groupes qui deviennent vides
        updatedGroups = updatedGroups.filter(group => group.transactions.length > 0);
        return updatedGroups;
      });
      totalBalance.update(currentBalance => {
        return currentBalance + removedTransaction[0].amount;
      });
      
      // naviguer vers une autre page, ou afficher une notification.
    } catch (error) {
      console.error(error);
      // Gestion des erreurs : notification, message d’erreur, etc.
    }
  }
</script>

<Button outline color="dark"  on:click={handleDelete}>
	<Icon name="trash" />
</Button>