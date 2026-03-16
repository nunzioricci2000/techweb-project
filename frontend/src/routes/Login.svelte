<script>
    export let authStore;
    export let actions;

    let username = "";
    let password = "";

    async function onSubmit(event) {
        event.preventDefault();
        const session = await actions.login({ username, password });
        if (session) {
            window.location.hash = "#/home";
        }
    }
</script>

<section>
    <h1>Login</h1>

    <form on:submit={onSubmit}>
        <label>
            Username
            <input type="text" bind:value={username} />
        </label>

        <label>
            Password
            <input type="password" bind:value={password} />
        </label>

        <button type="submit" disabled={$authStore.isLoading}>
            {$authStore.isLoading ? "Logging in..." : "Login"}
        </button>
    </form>

    {#if $authStore.error}
        <p>{$authStore.error}</p>
    {/if}
</section>
