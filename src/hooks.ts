import { createServerClient } from "$lib/ApolloClient";
import auth from "$lib/Auth";
import { config } from "$lib/config";
import { serializeAccessToken, serializeRefreshToken } from "$lib/CookieUtil";
import CookieManager from "$lib/CookieUtil/manager";
import type { GetSession, Handle } from "@sveltejs/kit";
import { sequence } from '@sveltejs/kit/hooks';


export const getSession: GetSession = (request) => {
    console.error('request', request);
    return {
        user: request?.locals?.currentUser,
        apollo: request?.locals?.apolloClient,
    }
}

export const apolloClient: Handle = async ({ request, resolve }) => {
    request.locals.apolloClient = createServerClient(request);

    let response = await resolve(request);

    return {
        ...response,
        headers: {
            ...response.headers,
            ...request.locals.headers
        }
    }
}


export const authMiddleware: Handle = async ({ request, resolve }) => {
    let cookieManager = new CookieManager(request.headers.cookie);
    let accessToken = cookieManager.getCookie(config.accessTokenCookieName);
    let refreshToken = cookieManager.getCookie(config.refreshTokenCookieName);

    if (!accessToken || !refreshToken) {
        const user = await auth.request();
        accessToken = user.accessToken;
        refreshToken = user.refreshToken;
    }

    let response = await resolve(request);
    return {
        ...response,
        headers: {
            ...response.headers,
            'Set-Cookie': [
                serializeAccessToken(accessToken),
                serializeRefreshToken(refreshToken)
            ]

        }
    }
}

export const handle = sequence(apolloClient, authMiddleware)