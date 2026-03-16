import { TokenService } from '@techweb-project/auth-core';
import Koa from 'koa';

/**
 * Authentication middleware for Koa.js
 * @param {TokenService} tokenService - The service used to verify JWT tokens
 * @returns {Koa.Middleware} Koa middleware function
 */
export function authMiddleware(tokenService) {
    return async (ctx, next) => {
        const authHeader = ctx.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            ctx.state.user = null;
            await next();
            return;
        }
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        try {
            const username = await tokenService.validateToken(token);
            ctx.state.user = { username };
        } catch (error) {
            ctx.state.user = null;
        }
        await next();
    };
}
