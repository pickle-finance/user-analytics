export const config: Record<any, any> = {
    appHost: import.meta.env.VITE_APP_HOST,
    accessTokenCookieName: import.meta.env.VITE_ACCESS_TOKEN_COOKIE_NAME,
    refreshTokenCookieName: import.meta.env.VITE_REFRESH_TOKEN_COOKIE_NAME,
    appDomain: import.meta.env.VITE_APP_DOMAIN,
    apiUrl: import.meta.env.VITE_API_URL,
    realmAppName: import.meta.env.VITE_REALM_APP_NAME,
    realmAppId: import.meta.env.VITE_REALM_APP_ID,
    realmApiKey: import.meta.env.VITE_REALM_API_KEY,
    posthog: {
        token: import.meta.env.VITE_POSTHOG_TOKEN,
        host: import.meta.env.VITE_POSTHOG_HOST,
        eventName: import.meta.env.VITE_POSTHOG_EVENT_NAME,
        cookieName: import.meta.env.VITE_POSTHOG_COOKIE_NAME,
    }
};