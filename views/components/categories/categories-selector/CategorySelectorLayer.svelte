<script lang="ts">
    import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "yesvelte/offcanvas";
    import CategorySelector from "./CategorySelector.svelte";
    import { categories } from '../../../stores/categoriesStore.js';
    import { Button } from "yesvelte/button";
    import { Icon } from "yesvelte/icon";
    import type { CategoryWithChildren } from "types/interfaces.js";
    import { createEventDispatcher } from "svelte";



    export let showCategories: any;
    export let transactionType: 'income' | 'expense';

    const dispatch = createEventDispatcher();
    let currentItems:CategoryWithChildren[] = [];
    const defaultTitle: string = "Choisir une catégorie"
    let title: string = defaultTitle ;
    let showBack = false;


    $: if (showCategories && !showBack) {
        currentItems = $categories.filter(cat => cat.type === transactionType);
    }

    function handleChange(event: CustomEvent<{ items: CategoryWithChildren[], title: string }>): void {
    currentItems = event.detail.items;
    title = event.detail.title;
    showBack = true;
  }

    function goBack(): void {
    currentItems = $categories.filter(cat => cat.type === transactionType);
    showBack = false;
    title = defaultTitle;
  }

  function handleSelectCategory(event: CustomEvent<CategoryWithChildren>) {
    dispatch('selectCategory', event.detail);
  }

  $: if (!showCategories) {
    console.log("showCategories+++", showCategories);
    dispatch('closeCategoryLayer');
    currentItems = $categories.filter(cat => cat.type === transactionType);
    title = defaultTitle;
    showBack = false;
  }
</script>

<Offcanvas placement="end" bind:show={showCategories} noScroll autoClose>
    <OffcanvasHeader >
        <div class="category-selector-layer__header">
          {#if showBack}
              <Button 
              class="backButton"
              color="primary"
              on:click={goBack}
              >
              <Icon name="arrow-left" />
              </Button>
          {/if}

          <div class="y-el y-offcanvas-header-title category-selector-layer__header-title">{title}</div>
        </div>
    </OffcanvasHeader>
    <OffcanvasBody>
        <CategorySelector
        itemsToShow={currentItems}
        on:change={handleChange}
        on:selectCategory={handleSelectCategory}
        />
    </OffcanvasBody>
    
</Offcanvas>

<style lang="scss">
  .category-selector-layer {
    &__header{
      display: flex;
      gap:1rem;
      &-title{
        display: flex;
        align-items: center;
      }
    }
  }
</style>