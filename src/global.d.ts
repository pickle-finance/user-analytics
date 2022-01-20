/// <reference types="@sveltejs/kit" />
/// <reference types="@apollo/client/core" />

interface ImportMetaEnv {
    VITE_APP_DOMAIN: string;
    VITE_APP_HOST: string;
    VITE_VERCEL_URL: string;
    VITE_ACCESS_TOKEN_COOKIE_NAME: string;
    VITE_REFRESH_TOKEN_COOKIE_NAME: string;
    VITE_REALM_APP_NAME: string;
    VITE_REALM_APP_ID: string;
    VITE_REALM_API_KEY: string;
    VITE_API_URL: string;
}

interface Session {
    user: any,
    apollo: ApolloClient<any>
}