import { config } from "$lib/config";
import { HttpLink } from "@apollo/client/link/http";
import { onError } from "@apollo/client/link/error";
import { setAccessToken, removeAccessToken, removeRefreshToken, setRefreshToken } from "$lib/CookieUtil";
import getValidAccessToken from "./authTokens";
import CookieManager from '$lib/CookieUtil/manager';

let errorLink = onError(({ networkError }) => {
    //@ts-ignore
    if (networkError?.statusCode === 401) {
        let cookieManager = new CookieManager();

        removeAccessToken(cookieManager)
        removeRefreshToken(cookieManager);
        return;
    }
});

let httpLink = new HttpLink({
    uri: config.apiUrl + "/app" + config.realmApiKey + "/graphql",
    fetch: async (uri: string, options: any) => {
        let cookieManager = new CookieManager();
        const [accessToken, shouldUpdateCookie, newRefreshToken] = await getValidAccessToken();
        if (shouldUpdateCookie) {
            // Update cookies store with the new access token value only on browser
            setAccessToken(cookieManager, accessToken);
        }
        if (newRefreshToken) {
            // Update cookies store with the new refresh token value only on browser
            setRefreshToken(cookieManager, newRefreshToken);
        }
        options.headers.Authorization = `Bearer ${accessToken}`;
        return fetch(uri, options);
    }
});

export { errorLink, httpLink }