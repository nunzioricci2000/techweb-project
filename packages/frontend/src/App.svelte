<script>
    import { onMount } from "svelte";
    import Login from "./routes/Login.svelte";
    import Signup from "./routes/Signup.svelte";
    import Home from "./routes/Home.svelte";

    export let authStore;
    export let actions;

    let currentRoute = "/login";

    function resolveRoute() {
        const hash = window.location.hash || "#/login";
        const route = hash.replace(/^#/, "");
        if (["/login", "/signup", "/home"].includes(route)) {
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

    $: if (currentRoute === "/home" && !$authStore.isAuthenticated) {
        currentRoute = "/login";
        window.location.hash = "#/login";
    }
</script>

<nav>
    <a href="#/login">Login</a>
    <a href="#/signup">Signup</a>
    {#if $authStore.isAuthenticated}
        <button type="button" on:click={onLogout}>Logout</button>
    {/if}
</nav>

<main>
    {#if currentRoute === "/signup"}
        <Signup {authStore} {actions} />
    {:else if currentRoute === "/home"}
        <Home {authStore} />
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
