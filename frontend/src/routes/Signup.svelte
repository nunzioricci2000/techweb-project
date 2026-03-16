<script>
    export let authStore;
    export let actions;

    let username = "";
    let password = "";

    async function onSubmit(event) {
        event.preventDefault();
        const createdUsername = await actions.signup({ username, password });
        if (createdUsername) {
            window.location.hash = "#/login";
        }
    }
</script>

<section>
    <h1>Signup</h1>

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
            {$authStore.isLoading ? "Creating account..." : "Signup"}
        </button>
    </form>

    {#if $authStore.error}
        <p>{$authStore.error}</p>
    {/if}

    {#if $authStore.lastSignupUsername}
        <p>
            Account created for {$authStore.lastSignupUsername}. You can now
            login.
        </p>
    {/if}
</section>
