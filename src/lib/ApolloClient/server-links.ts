import { config } from "$lib/config";
import { HttpLink } from "@apollo/client/link/http";
import { onError } from "@apollo/client/link/error";
import { fromPromise } from "@apollo/client/link/utils";
import { serializeAccessToken, serializeRefreshToken } from "$lib/CookieUtil";
import getValidAccessToken from "./authTokens";
import type { Request } from "@sveltejs/kit";

let errorServerLink = (req: Request) => onError(({ networkError, forward, operation }) => {
    //@ts-ignore
    if (networkError?.statusCode === 401) {
        fromPromise(getValidAccessToken().then(([accessToken, _, newRefreshToken]) => {
            req.locals.headers = {
                'Set-Cookie': [
                    serializeAccessToken(accessToken),
                    serializeRefreshToken(newRefreshToken)
                ]
            }
            operation.setContext({
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return forward(operation);
        }));
    }
});

let httpServerLink = (req: Request) => {
    return new HttpLink({
        uri: config.apiUrl + "/app/" + config.realmAppId + "/graphql",
        fetch: async (url: string, options: any) => {
            const [accessToken, shouldUpdateCookie, newRefreshToken] = await getValidAccessToken(req?.headers?.cookie);
            options.headers.Authorization = `Bearer ${accessToken}`;
            if (shouldUpdateCookie) {
                if (newRefreshToken) {
                    req.locals.headers = {
                        'Set-Cookie': [
                            serializeAccessToken(accessToken),
                            serializeRefreshToken(newRefreshToken)
                        ]
                    }
                } else {
                    req.locals.headers = {
                        'Set-Cookie': serializeAccessToken(accessToken)
                    }
                }
            }
            return fetch(url, options);
        },
        credentials: 'include',
    });
};

export { errorServerLink, httpServerLink }
