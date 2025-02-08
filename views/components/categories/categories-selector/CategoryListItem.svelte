<script lang="ts">
    import { createEventDispatcher, tick } from "svelte";
    import { Icon } from "yesvelte/icon";

    export let label: string;
    export let id: string;
    export let iconLabel: string | null;
    export let iconColor: string | null;
    export let children: any[] = [];
    export let size: 's' | 'm' | 'l' = 'm';
    export let isEditable: boolean = false;

    const dispatch = createEventDispatcher();


    function handleClick(event: MouseEvent) {
        if (children && children.length > 0) {
            dispatch("showChildren");
        } else {
            dispatch("categorySelected", { id, label, iconLabel, iconColor });
        }
        dispatch("click", event);
    }
</script>

<div class="category-list-item">
    <button 
        class="category-list-item__button category-list-item__button--{size}" 
        type="button" 
        on:click={handleClick} 
        style="--iconColor:{iconColor};"
    >
        <span  class="category-list-item__icon category-list-item__icon--{size}">
            <Icon name="{iconLabel}" />
        </span>
        
        <span  class="category-list-item__label category-list-item__label--{size}">
            {label}        
        </span>  

        {#if children && children.length > 0}
            <Icon class="category-list-item__arrow category-list-item__arrow--{size}" name="arrow-right" />
        {/if}
        {#if isEditable}
            <Icon name="edit" class="category-list-item__arrow category-list-item__arrow--{size}"  title="Choisir la catégorie" />
        {/if}
    </button>

</div>

<style lang="scss">
    .category-list-item {
        width: 100%;
        &__button{
            display: block;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
            background-color:rgba(var(--iconColor),.25);
            border: 1px solid rgb(var(--iconColor));
            padding: 0.125rem 0.25rem;
            border-radius: 50px;
            &--m{
                padding: 0.25rem 0.5rem;  
            }
            &:hover{
                opacity: 0.8;
            }
        }
        &__icon{
            display: flex;
            flex-grow: 0;
            flex-shrink: 0;
            justify-content: center;
            align-items: center;
            padding: 0.125rem;
            border: 1px solid rgb(var(--iconColor));
            background-color:rgba(var(--iconColor),.3);
            border-radius: 100%;
            font-size: 0.5rem;
            &--m{
                font-size: 1rem;
                padding: 0.5rem;
            }
            :global(.y-icon) {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        &__label{
            flex-grow: 1;
            text-align: left;
        }
        &__arrow{
            justify-self: flex-end;
        }
    }
  </style>
  