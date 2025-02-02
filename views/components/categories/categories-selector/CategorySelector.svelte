<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	  import CategoryListItem from './CategoryListItem.svelte';
    import type { CategoryWithChildren } from 'types/interfaces.js';

    export let itemsToShow: CategoryWithChildren[];
    const dispatch = createEventDispatcher();

    function handleShowChildren(e: CustomEvent<any>, item: CategoryWithChildren) {
      dispatch('change', { items: item.children, title: item.name });
    }
    function handleCategorySelected(e: { detail: any; }) {
    dispatch('selectCategory', e.detail);
  }
</script>
<ul>
{#each itemsToShow as item }
  <CategoryListItem 
    label={item.name} 
    id={item.id}
    children={item.children}
      on:showChildren={(e) => handleShowChildren(e, item)}
      on:categorySelected={handleCategorySelected}
  />
{/each}

</ul>

<style lang="scss">

</style>