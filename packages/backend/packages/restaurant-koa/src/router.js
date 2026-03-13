import Router from "@koa/router";
import multer from "@koa/multer";
import { Image, RestaurantCoreRegistry } from "@techweb-project/restaurant-core";
import { ReviewCoreRegistry } from "@techweb-project/review-core";
import { HttpGetRestaurantsPresenter } from "./presenters/http_get_restaurants_presenter.js";
import { HttpGetRestaurantPresenter } from "./presenters/http_get_restaurant_presenter.js";
import { HttpCreateRestaurantPresenter } from "./presenters/http_create_restaurant_presenter.js";
import { HttpUpdateRestaurantPresenter } from "./presenters/http_update_restaurant_presenter.js";
import { HttpDeleteRestaurantPresenter } from "./presenters/http_delete_restaurant_presenter.js";
import { HttpGetReviewsPresenter } from "./presenters/http_get_reviews_presenter.js";
import { HttpCreateReviewPresenter } from "./presenters/http_create_review_presenter.js";
import { HttpDeleteReviewPresenter } from "./presenters/http_delete_review_presenter.js";
import { HttpCastVotePresenter } from "./presenters/http_cast_vote_presenter.js";

function requireAuth(ctx) {
    if (!ctx.state.user?.username) {
        ctx.status = 401;
        ctx.body = { error: "Authentication required" };
        return false;
    }

    return true;
}

function buildRestaurantRegistry({ loggerService, restaurantRepository, presenters }) {
    return new RestaurantCoreRegistry({
        loggerService,
        restaurantRepository,
        getRestaurantsPresenter: presenters.getRestaurantsPresenter,
        getRestaurantPresenter: presenters.getRestaurantPresenter,
        createRestaurantPresenter: presenters.createRestaurantPresenter,
        updateRestaurantPresenter: presenters.updateRestaurantPresenter,
        deleteRestaurantPresenter: presenters.deleteRestaurantPresenter
    });
}

function buildReviewRegistry({ loggerService, reviewRepository, presenters }) {
    return new ReviewCoreRegistry({
        loggerService,
        reviewRepository,
        getReviewsPresenter: presenters.getReviewsPresenter,
        createReviewPresenter: presenters.createReviewPresenter,
        deleteReviewPresenter: presenters.deleteReviewPresenter,
        castVotePresenter: presenters.castVotePresenter
    });
}

export function createRestaurantRouter({ loggerService, restaurantRepository, reviewRepository, uploadsDir }) {
    const router = new Router();
    const upload = multer({ dest: uploadsDir });

    router.get("/restaurants", async (ctx) => {
        const getRestaurantsPresenter = new HttpGetRestaurantsPresenter();
        const restaurantRegistry = buildRestaurantRegistry({
            loggerService,
            restaurantRepository,
            presenters: {
                getRestaurantsPresenter,
                getRestaurantPresenter: new HttpGetRestaurantPresenter(),
                createRestaurantPresenter: new HttpCreateRestaurantPresenter(),
                updateRestaurantPresenter: new HttpUpdateRestaurantPresenter(),
                deleteRestaurantPresenter: new HttpDeleteRestaurantPresenter()
            }
        });

        await restaurantRegistry.getGetRestaurantsInteractor().execute({
            page: Number(ctx.query.page) || 1,
            pageSize: Number(ctx.query.pageSize) || 10,
            nameFilter: ctx.query.nameFilter
        });

        ctx.status = getRestaurantsPresenter.response.status;
        ctx.body = getRestaurantsPresenter.response.body;
    });

    router.get("/restaurants/:id", async (ctx) => {
        const getRestaurantPresenter = new HttpGetRestaurantPresenter();
        const restaurantRegistry = buildRestaurantRegistry({
            loggerService,
            restaurantRepository,
            presenters: {
                getRestaurantsPresenter: new HttpGetRestaurantsPresenter(),
                getRestaurantPresenter,
                createRestaurantPresenter: new HttpCreateRestaurantPresenter(),
                updateRestaurantPresenter: new HttpUpdateRestaurantPresenter(),
                deleteRestaurantPresenter: new HttpDeleteRestaurantPresenter()
            }
        });

        await restaurantRegistry.getGetRestaurantByIdInteractor().execute({
            restaurantId: Number(ctx.params.id)
        });

        ctx.status = getRestaurantPresenter.response.status;
        ctx.body = getRestaurantPresenter.response.body;
    });

    router.post("/restaurants", upload.single("image"), async (ctx) => {
        if (!requireAuth(ctx)) {
            return;
        }

        const createRestaurantPresenter = new HttpCreateRestaurantPresenter();
        const restaurantRegistry = buildRestaurantRegistry({
            loggerService,
            restaurantRepository,
            presenters: {
                getRestaurantsPresenter: new HttpGetRestaurantsPresenter(),
                getRestaurantPresenter: new HttpGetRestaurantPresenter(),
                createRestaurantPresenter,
                updateRestaurantPresenter: new HttpUpdateRestaurantPresenter(),
                deleteRestaurantPresenter: new HttpDeleteRestaurantPresenter()
            }
        });

        const imageUrl = ctx.file ? `/uploads/${ctx.file.filename}` : null;

        await restaurantRegistry.getCreateRestaurantInteractor().execute({
            name: ctx.request.body?.name,
            description: ctx.request.body?.description,
            geolocation: {
                latitude: Number(ctx.request.body?.latitude),
                longitude: Number(ctx.request.body?.longitude)
            },
            image: imageUrl ? new Image(imageUrl) : null,
            ownerUsername: ctx.state.user.username
        });

        ctx.status = createRestaurantPresenter.response.status;
        ctx.body = createRestaurantPresenter.response.body;
    });

    router.put("/restaurants/:id", upload.single("image"), async (ctx) => {
        if (!requireAuth(ctx)) {
            return;
        }

        const updateRestaurantPresenter = new HttpUpdateRestaurantPresenter();
        const restaurantRegistry = buildRestaurantRegistry({
            loggerService,
            restaurantRepository,
            presenters: {
                getRestaurantsPresenter: new HttpGetRestaurantsPresenter(),
                getRestaurantPresenter: new HttpGetRestaurantPresenter(),
                createRestaurantPresenter: new HttpCreateRestaurantPresenter(),
                updateRestaurantPresenter,
                deleteRestaurantPresenter: new HttpDeleteRestaurantPresenter()
            }
        });

        const updatePayload = {
            restaurantId: Number(ctx.params.id),
            requesterUsername: ctx.state.user.username,
            name: ctx.request.body?.name,
            description: ctx.request.body?.description
        };

        if (ctx.request.body?.latitude != null && ctx.request.body?.longitude != null) {
            updatePayload.geolocation = {
                latitude: Number(ctx.request.body.latitude),
                longitude: Number(ctx.request.body.longitude)
            };
        }

        if (ctx.file) {
            updatePayload.image = new Image(`/uploads/${ctx.file.filename}`);
        }

        await restaurantRegistry.getUpdateRestaurantInteractor().execute(updatePayload);

        ctx.status = updateRestaurantPresenter.response.status;
        ctx.body = updateRestaurantPresenter.response.body;
    });

    router.delete("/restaurants/:id", async (ctx) => {
        if (!requireAuth(ctx)) {
            return;
        }

        const deleteRestaurantPresenter = new HttpDeleteRestaurantPresenter();
        const restaurantRegistry = buildRestaurantRegistry({
            loggerService,
            restaurantRepository,
            presenters: {
                getRestaurantsPresenter: new HttpGetRestaurantsPresenter(),
                getRestaurantPresenter: new HttpGetRestaurantPresenter(),
                createRestaurantPresenter: new HttpCreateRestaurantPresenter(),
                updateRestaurantPresenter: new HttpUpdateRestaurantPresenter(),
                deleteRestaurantPresenter
            }
        });

        await restaurantRegistry.getDeleteRestaurantInteractor().execute({
            restaurantId: Number(ctx.params.id),
            requesterUsername: ctx.state.user.username
        });

        ctx.status = deleteRestaurantPresenter.response.status;
        ctx.body = deleteRestaurantPresenter.response.body;
    });

    router.get("/restaurants/:id/reviews", async (ctx) => {
        const getReviewsPresenter = new HttpGetReviewsPresenter();
        const reviewRegistry = buildReviewRegistry({
            loggerService,
            reviewRepository,
            presenters: {
                getReviewsPresenter,
                createReviewPresenter: new HttpCreateReviewPresenter(),
                deleteReviewPresenter: new HttpDeleteReviewPresenter(),
                castVotePresenter: new HttpCastVotePresenter()
            }
        });

        await reviewRegistry.getGetReviewsByRestaurantInteractor().execute({
            restaurantId: Number(ctx.params.id)
        });

        ctx.status = getReviewsPresenter.response.status;
        ctx.body = getReviewsPresenter.response.body;
    });

    router.post("/restaurants/:id/reviews", async (ctx) => {
        if (!requireAuth(ctx)) {
            return;
        }

        const createReviewPresenter = new HttpCreateReviewPresenter();
        const reviewRegistry = buildReviewRegistry({
            loggerService,
            reviewRepository,
            presenters: {
                getReviewsPresenter: new HttpGetReviewsPresenter(),
                createReviewPresenter,
                deleteReviewPresenter: new HttpDeleteReviewPresenter(),
                castVotePresenter: new HttpCastVotePresenter()
            }
        });

        await reviewRegistry.getCreateReviewInteractor().execute({
            content: ctx.request.body?.content,
            authorUsername: ctx.state.user.username,
            restaurantId: Number(ctx.params.id)
        });

        ctx.status = createReviewPresenter.response.status;
        ctx.body = createReviewPresenter.response.body;
    });

    router.delete("/reviews/:id", async (ctx) => {
        if (!requireAuth(ctx)) {
            return;
        }

        const deleteReviewPresenter = new HttpDeleteReviewPresenter();
        const reviewRegistry = buildReviewRegistry({
            loggerService,
            reviewRepository,
            presenters: {
                getReviewsPresenter: new HttpGetReviewsPresenter(),
                createReviewPresenter: new HttpCreateReviewPresenter(),
                deleteReviewPresenter,
                castVotePresenter: new HttpCastVotePresenter()
            }
        });

        await reviewRegistry.getDeleteReviewInteractor().execute({
            reviewId: Number(ctx.params.id),
            requesterUsername: ctx.state.user.username
        });

        ctx.status = deleteReviewPresenter.response.status;
        ctx.body = deleteReviewPresenter.response.body;
    });

    router.post("/reviews/:id/vote", async (ctx) => {
        if (!requireAuth(ctx)) {
            return;
        }

        const castVotePresenter = new HttpCastVotePresenter();
        const reviewRegistry = buildReviewRegistry({
            loggerService,
            reviewRepository,
            presenters: {
                getReviewsPresenter: new HttpGetReviewsPresenter(),
                createReviewPresenter: new HttpCreateReviewPresenter(),
                deleteReviewPresenter: new HttpDeleteReviewPresenter(),
                castVotePresenter
            }
        });

        await reviewRegistry.getCastVoteInteractor().execute({
            reviewId: Number(ctx.params.id),
            authorUsername: ctx.state.user.username,
            value: Number(ctx.request.body?.value)
        });

        ctx.status = castVotePresenter.response.status;
        ctx.body = castVotePresenter.response.body;
    });

    return router;
}
