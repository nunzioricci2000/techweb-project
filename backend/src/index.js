import Koa from 'koa';
import KoaRouter from '@koa/router';
import bodyParser from '@koa/bodyparser';
import { initializeDatabase } from './infrastructure/database/database.js';
import JwtTokenService from './infrastructure/services/jwt_token_service.js';
import { SequelizeUserRepository } from './interface_adapters/repositories/sequelize_user_repository.js';
import Argon2HashService from './infrastructure/services/argon2_hash_service.js';
import KoaLoginPresenter from './interface_adapters/presenters/koa_login_presenter.js';
import KoaSignupPresenter from './interface_adapters/presenters/koa_signup_presenter.js';
import Login from './core/use_cases/login.js';
import Signup from './core/use_cases/signup.js';
import KoaAuthController from './interface_adapters/controllers/koa_auth_controller.js';
import ConsoleLoggerService from './infrastructure/services/console_logger_service.js';
import MissingRequestParameterError from './core/use_cases/errors/missing_request_parameter.js';

async function awaitMain() {
    try {
        await initializeDatabase();
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
    const dependencies = wireDependencies();
    const app = new Koa();
    const router = new KoaRouter();
    router.get('/', async (ctx) => {
        ctx.body = 'Hello, World!';
    });
    const authRouter = new KoaRouter({ prefix: '/auth' });
    authRouter.use(bodyParser());
    authRouter.post('/login', async (ctx) => {
        const { authController } = composeAuthFeatures(ctx, dependencies);
        await authController.login(ctx);
    });
    authRouter.post('/signup', async (ctx) => {
        const { authController } = composeAuthFeatures(ctx, dependencies);
        await authController.signup(ctx);
    });
    router.use(authRouter.routes()).use(authRouter.allowedMethods());
    app.use(router.routes()).use(router.allowedMethods());
    app.on('error', (err, ctx) => {
        console.error('Server error:', err);
        if (err instanceof MissingRequestParameterError) {
            console.warn('A request was made with missing parameters:', err.message);
            ctx.status = 400;
            ctx.body = { error: err.message };
        }
    });
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}

function wireDependencies() {
    const loggerService = new ConsoleLoggerService();
    const hashService = new Argon2HashService(loggerService);
    const userRepository = new SequelizeUserRepository(loggerService);
    const tokenService = new JwtTokenService("your-secret-key", "1h", loggerService);

    return { loggerService, hashService, userRepository, tokenService };
}

/**
 * @param {import('koa').Context} ctx
 * @param {Object} dependencies
 */
function composeAuthFeatures(ctx, dependencies) {
    const { loggerService, hashService, userRepository, tokenService } = dependencies;
    const loginPresenter = new KoaLoginPresenter(ctx, loggerService);
    const signupPresenter = new KoaSignupPresenter(ctx, loggerService);
    const loginInteractor = new Login(userRepository, hashService, tokenService, loginPresenter, loggerService);
    const signupInteractor = new Signup(userRepository, hashService, signupPresenter, loggerService);
    const authController = new KoaAuthController(loginInteractor, signupInteractor, loggerService);
    return {
        loginPresenter,
        signupPresenter,
        loginInteractor,
        signupInteractor,
        authController
    };
}

await awaitMain();