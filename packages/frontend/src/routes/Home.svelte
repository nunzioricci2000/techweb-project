<script>
    import { onMount } from "svelte";

    export let authStore;
    export let restaurantStore;
    export let restaurantActions;

    let nameFilter = "";

    async function load(page = 1) {
        await restaurantActions.getRestaurants({
            page,
            pageSize: 10,
            nameFilter,
        });
    }

    async function onSearch(event) {
        event.preventDefault();
        await load(1);
    }

    function goToRestaurant(restaurantId) {
        window.location.hash = `#/restaurants/${restaurantId}`;
    }

    onMount(async () => {
        await load(1);
    });
</script>

<section>
    <h1>Restaurants</h1>

    <form on:submit={onSearch}>
        <label>
            Search by name
            <input type="text" bind:value={nameFilter} />
        </label>
        <button type="submit" disabled={$restaurantStore.isLoading}
            >Search</button
        >
    </form>

    {#if $restaurantStore.error}
        <p>{$restaurantStore.error}</p>
    {/if}

    <p>Authenticated: {$authStore.isAuthenticated ? "yes" : "no"}</p>

    <ul>
        {#each $restaurantStore.restaurants as restaurant}
            <li>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
                {#if restaurant.image?.url}
                    <img
                        src={restaurant.image.url}
                        alt={restaurant.name}
                        width="160"
                    />
                {/if}
                <button
                    type="button"
                    on:click={() => goToRestaurant(restaurant.id)}>View</button
                >
            </li>
        {/each}
    </ul>

    <div>
        <button
            type="button"
            on:click={() => load(Math.max(1, $restaurantStore.page - 1))}
            disabled={$restaurantStore.isLoading || $restaurantStore.page <= 1}
        >
            Prev
        </button>
        <span>Page {$restaurantStore.page}</span>
        <button
            type="button"
            on:click={() => load($restaurantStore.page + 1)}
            disabled={$restaurantStore.isLoading}
        >
            Next
        </button>
    </div>
</section>
