<script>
    import { onMount } from "svelte";
    import Login from "./routes/Login.svelte";
    import Signup from "./routes/Signup.svelte";
    import Home from "./routes/Home.svelte";
    import RestaurantDetail from "./routes/RestaurantDetail.svelte";
    import CreateRestaurant from "./routes/CreateRestaurant.svelte";

    export let authStore;
    export let actions;
    export let restaurantStore;
    export let restaurantActions;

    let currentRoute = "/login";
    let selectedRestaurantId = null;

    function resolveRoute() {
        const hash = window.location.hash || "#/login";
        const route = hash.replace(/^#/, "");

        if (route.startsWith("/restaurants/") && route !== "/restaurants/new") {
            const id = Number(route.replace("/restaurants/", ""));
            if (!Number.isNaN(id) && id > 0) {
                selectedRestaurantId = id;
                currentRoute = "/restaurants/:id";
                return;
            }
        }

        if (
            ["/login", "/signup", "/home", "/restaurants/new"].includes(route)
        ) {
            currentRoute = route;
            return;
        }

        currentRoute = "/login";
        window.location.hash = "#/login";
    }

    async function onLogout() {
        await actions.logout();
        window.location.hash = "#/login";
    }

    onMount(() => {
        resolveRoute();
        window.addEventListener("hashchange", resolveRoute);
        return () => window.removeEventListener("hashchange", resolveRoute);
    });

    $: if (
        (currentRoute === "/home" || currentRoute === "/restaurants/new") &&
        !$authStore.isAuthenticated
    ) {
        currentRoute = "/login";
        window.location.hash = "#/login";
    }
</script>

<nav>
    <a href="#/login">Login</a>
    <a href="#/signup">Signup</a>
    <a href="#/home">Restaurants</a>
    {#if $authStore.isAuthenticated}
        <a href="#/restaurants/new">Create Restaurant</a>
    {/if}
    {#if $authStore.isAuthenticated}
        <button type="button" on:click={onLogout}>Logout</button>
    {/if}
</nav>

<main>
    {#if currentRoute === "/signup"}
        <Signup {authStore} {actions} />
    {:else if currentRoute === "/home"}
        <Home {authStore} {restaurantStore} {restaurantActions} />
    {:else if currentRoute === "/restaurants/new"}
        <CreateRestaurant {restaurantStore} {restaurantActions} />
    {:else if currentRoute === "/restaurants/:id"}
        <RestaurantDetail
            {authStore}
            {restaurantStore}
            {restaurantActions}
            restaurantId={selectedRestaurantId}
        />
    {:else}
        <Login {authStore} {actions} />
    {/if}
</main>

<style>
    :global(body) {
        font-family: sans-serif;
        margin: 0;
        padding: 2rem;
    }

    nav {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1rem;
        align-items: center;
    }

    :global(form) {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 320px;
    }

    :global(label) {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    button {
        width: fit-content;
    }
</style>
