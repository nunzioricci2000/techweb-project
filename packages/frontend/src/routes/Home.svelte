<script>
    export let authStore;
</script>

<section>
    <h1>Home</h1>
    <p>Authenticated area.</p>
    <p>Token present: {$authStore.token ? "yes" : "no"}</p>
</section>
