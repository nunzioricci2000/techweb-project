<script>
    import { onMount } from "svelte";

    export let authStore;
    export let restaurantStore;
    export let restaurantActions;
    export let restaurantId;

    let reviewContent = "";

    async function load() {
        await restaurantActions.getRestaurantById(restaurantId);
    }

    async function onCreateReview(event) {
        event.preventDefault();
        const created = await restaurantActions.createReview({
            restaurantId,
            content: reviewContent,
        });
        if (created) {
            reviewContent = "";
        }
    }

    async function onDeleteReview(reviewId) {
        await restaurantActions.deleteReview({ restaurantId, reviewId });
    }

    async function onVote(reviewId, value) {
        await restaurantActions.castVote({ restaurantId, reviewId, value });
    }

    async function onDeleteRestaurant() {
        const ok = await restaurantActions.deleteRestaurant({ restaurantId });
        if (ok) {
            window.location.hash = "#/home";
        }
    }

    onMount(async () => {
        await load();
    });
</script>

<section>
    <button type="button" on:click={() => (window.location.hash = "#/home")}
        >Back</button
    >

    {#if $restaurantStore.currentRestaurant}
        <h1>{$restaurantStore.currentRestaurant.name}</h1>
        <p>{$restaurantStore.currentRestaurant.description}</p>
        {#if $restaurantStore.currentRestaurant.image?.url}
            <img
                src={$restaurantStore.currentRestaurant.image.url}
                alt={$restaurantStore.currentRestaurant.name}
                width="320"
            />
        {/if}
        <p>
            Lat: {$restaurantStore.currentRestaurant.geolocation?.latitude} | Lng:
            {$restaurantStore.currentRestaurant.geolocation?.longitude}
        </p>
        <p>Owner: {$restaurantStore.currentRestaurant.owner?.username}</p>

        {#if $authStore.isAuthenticated}
            <button
                type="button"
                on:click={onDeleteRestaurant}
                disabled={$restaurantStore.isLoading}>Delete restaurant</button
            >
        {/if}
    {/if}

    <h2>Reviews</h2>
    {#if $restaurantStore.error}
        <p>{$restaurantStore.error}</p>
    {/if}

    <ul>
        {#each $restaurantStore.reviews as review}
            <li>
                <p>{review.content}</p>
                <small>Author: {review.authorUsername}</small>
                <p>👍 {review.upvotes} | 👎 {review.downvotes}</p>

                {#if $authStore.isAuthenticated}
                    <button
                        type="button"
                        on:click={() => onVote(review.id, 1)}
                        disabled={$restaurantStore.isLoading}>Upvote</button
                    >
                    <button
                        type="button"
                        on:click={() => onVote(review.id, -1)}
                        disabled={$restaurantStore.isLoading}>Downvote</button
                    >
                {/if}

                {#if $authStore.isAuthenticated}
                    <button
                        type="button"
                        on:click={() => onDeleteReview(review.id)}
                        disabled={$restaurantStore.isLoading}>Delete</button
                    >
                {/if}
            </li>
        {/each}
    </ul>

    {#if $authStore.isAuthenticated}
        <h3>Write review</h3>
        <form on:submit={onCreateReview}>
            <label>
                Content
                <textarea bind:value={reviewContent}></textarea>
            </label>
            <button type="submit" disabled={$restaurantStore.isLoading}
                >Post review</button
            >
        </form>
    {/if}
</section>
