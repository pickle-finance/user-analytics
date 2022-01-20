import { createServerClient } from "$lib/ApolloClient";
import auth from "$lib/Auth";
import { config } from "$lib/config";
import { serializeAccessToken, serializeRefreshToken } from "$lib/CookieUtil";
import CookieManager from "$lib/CookieUtil/manager";
import type { GetSession, Handle } from "@sveltejs/kit";
import { sequence } from '@sveltejs/kit/hooks';


export const getSession: GetSession = (request) => {
    return {
        user: request?.locals?.currentUser,
        apollo: request?.locals?.apolloClient,
    }
}

const apolloClient: Handle = async (input) => {
    const { event, resolve } = input;
    event.locals.apolloClient = createServerClient(event);

    let response = await resolve(event);
    return {
        ...response,
        headers: {
            ...response.headers,
            ...event.locals?.headers
        }
    }
}


const authMiddleware: Handle = async ({ event, resolve }) => {
    let cookieManager = new CookieManager(event.request.headers.get('cookie'));
    let accessToken = cookieManager.getCookie(config.accessTokenCookieName);
    let refreshToken = cookieManager.getCookie(config.refreshTokenCookieName);

    if (!accessToken || !refreshToken) {
        const user = await auth.request();
        accessToken = user.accessToken;
        refreshToken = user.refreshToken;
    }

    let response = await resolve(event);
    return {
        ...response,
        headers: {
            ...response?.headers,
            'Set-Cookie': [
                serializeAccessToken(accessToken),
                serializeRefreshToken(refreshToken)
            ]

        }
    }
}

export const handle = sequence(apolloClient, authMiddleware)