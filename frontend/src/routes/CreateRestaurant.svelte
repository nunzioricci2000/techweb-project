<script>
    export let restaurantStore;
    export let restaurantActions;

    let name = "";
    let description = "";
    let latitude = "";
    let longitude = "";
    let imageFile = null;

    async function onSubmit(event) {
        event.preventDefault();
        const createdRestaurant = await restaurantActions.createRestaurant({
            name,
            description,
            latitude: Number(latitude),
            longitude: Number(longitude),
            imageFile,
        });

        if (createdRestaurant?.id) {
            window.location.hash = `#/restaurants/${createdRestaurant.id}`;
        }
    }
</script>

<section>
    <h1>Create Restaurant</h1>

    <form on:submit={onSubmit}>
        <label>
            Name
            <input type="text" bind:value={name} required />
        </label>

        <label>
            Description
            <textarea bind:value={description}></textarea>
        </label>

        <label>
            Latitude
            <input type="number" step="any" bind:value={latitude} required />
        </label>

        <label>
            Longitude
            <input type="number" step="any" bind:value={longitude} required />
        </label>

        <label>
            Image
            <input
                type="file"
                accept="image/*"
                on:change={(event) =>
                    (imageFile = event.currentTarget.files?.[0] || null)}
            />
        </label>

        <button type="submit" disabled={$restaurantStore.isLoading}
            >Create</button
        >
    </form>

    {#if $restaurantStore.error}
        <p>{$restaurantStore.error}</p>
    {/if}
</section>
