import { config } from "$lib/config";
import { HttpLink } from "@apollo/client/link/http";
import { onError } from "@apollo/client/link/error";
import { fromPromise } from "@apollo/client/link/utils";
import { setAccessToken, setRefreshToken } from "$lib/CookieUtil";
import getValidAccessToken from "./authTokens";
import CookieManager from '$lib/CookieUtil/manager';

let errorLink = onError(({ networkError, forward, operation }) => {
    //@ts-ignore
    if (networkError?.statusCode === 401) {
        fromPromise(getValidAccessToken().then(([accessToken, _, newRefreshToken]) => {
            let cookieManager = new CookieManager();
            setAccessToken(cookieManager, accessToken);
            setRefreshToken(cookieManager, newRefreshToken);

            operation.setContext({
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return forward(operation);
        }));
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