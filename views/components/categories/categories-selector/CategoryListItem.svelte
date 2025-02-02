<script lang="ts">
    import { createEventDispatcher, tick } from "svelte";

    export let label: string;
    export let id: string;
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

<li>
    <button type="button" on:click={handleClick}>
        {label}
    </button>

</li>