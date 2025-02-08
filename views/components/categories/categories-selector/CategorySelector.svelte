<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import CategoryListItem from './CategoryListItem.svelte';
  import type { CategoryWithChildren } from 'types/interfaces.js';

  export let itemsToShow: CategoryWithChildren[];
  const dispatch = createEventDispatcher();

  function handleShowChildren(e: CustomEvent<any>, item: CategoryWithChildren) {
    dispatch('change', { items: item.children, title: item.name });
  }
  function handleCategorySelected(e: { detail: any }) {
    dispatch('selectCategory', e.detail);
  }
</script>

<ul class="category-list">
  {#each itemsToShow as item}
  <li class="category-list__li">
    <CategoryListItem
      label={item.name}
      iconLabel={item.icon_label}
      iconColor={item.icon_color}
      id={item.id}
      children={item.children}
      on:showChildren={(e) => handleShowChildren(e, item)}
      on:categorySelected={handleCategorySelected}
    />
  </li>

  {/each}
</ul>

<style lang="scss">
  .category-list {
    margin: 0;
    padding: 0;
    &__li{
      list-style: none;
      margin: 0;
      padding: 0;
      padding: 0;
      margin: 0 0 1rem 0;    
    }
  }
</style>
