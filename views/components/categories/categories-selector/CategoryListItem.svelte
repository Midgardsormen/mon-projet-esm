<script lang="ts">
    import { createEventDispatcher, tick } from "svelte";
    import { Icon } from "yesvelte/icon";

    export let label: string;
    export let id: string;
    export let iconLabel: string | null;
    export let iconColor: string | null;
    export let children: any[] = [];

    const dispatch = createEventDispatcher();


    function handleClick() {
        if (children && children.length > 0) {
            dispatch("showChildren");
        } else {
            dispatch("categorySelected", { id, label });
        }
    }
</script>

<li class="category-list-item">
    <button class="category-list-item__button" type="button" on:click={handleClick} style="--iconColor:{iconColor};">
        <span  class="category-list-item__icon">
            <Icon name="{iconLabel}" />
        </span>
        
        <span  class="category-list-item__label">
            {label}        
        </span>  

        {#if children && children.length > 0}
            <Icon class="category-list-item__arrow" name="arrow-right" />
        {/if}
        
    </button>

</li>

<style lang="scss">
    .category-list-item {
        list-style: none;
        margin: 0;
        padding: 0;
        padding: 0;
        margin: 0 0 1rem 0;
        &__button{
            display: block;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
            background-color:rgba(var(--iconColor),.25);
            border: 1px solid rgb(var(--iconColor));
            padding: 0.25rem 0.5rem;
            border-radius: 50px;
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
            padding: 0.5rem;
            border: 1px solid rgb(var(--iconColor));
            background-color:rgba(var(--iconColor),.3);
            border-radius: 100%;
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
  