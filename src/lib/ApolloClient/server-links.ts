import { config } from "$lib/config";
import { HttpLink } from "@apollo/client/link/http";
import { onError } from "@apollo/client/link/error";
import { promiseToObservable } from "./handler";

let errorServerLink = onError(({ networkError, forward, operation }) => {
    //@ts-ignore
    if (networkError?.statusCode === 401) {
        return promiseToObservable(getAuthToken()).flatMap(({ accessToken }) => {
            operation.setContext({
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return forward(operation);
        })
    }
});

let httpServerLink = new HttpLink({
    uri: config.apiUrl + "/app/" + config.realmAppId + "/graphql",
    fetch: async (url: string, options: any) => {
        let data = await getAuthToken();
        options.headers.Authorization = `Bearer ${data?.accessToken}`;

        return fetch(url, options);
    },
    credentials: 'include',
});

async function getAuthToken() {
    return fetch(`${config.appHost}/api/getAuthToken`, { credentials: "include" }).then(res => res.json());
}


export { errorServerLink, httpServerLink }
