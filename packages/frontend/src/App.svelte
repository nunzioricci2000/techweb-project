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

    let currentRoute = "/home";
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
</script>

<header>
    <nav>
        <ul>
            <li><strong>Webtech's Fakerestaurant</strong></li>
        </ul>
        <ul>
            <li><a href="#/login">Login</a></li>
            <li><a href="#/signup">Signup</a></li>
            <li><a href="#/home">Restaurants</a></li>
            {#if $authStore.isAuthenticated}
                <li><a href="#/restaurants/new">Create Restaurant</a></li>
            {/if}
            {#if $authStore.isAuthenticated}
                <li>
                    <button type="button" on:click={onLogout}>Logout</button>
                </li>
            {/if}
        </ul>
    </nav>
</header>

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

<style lang="scss">
    @import url("https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css");
</style>
