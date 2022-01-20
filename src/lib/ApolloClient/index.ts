import 'isomorphic-fetch';
import { onDestroy } from 'svelte';
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { browser, dev } from '$app/env';
import type { Request } from '@sveltejs/kit';

import { httpLink, errorLink } from './browser-links';
import { httpServerLink, errorServerLink } from './server-links';
import { isEmpty } from '$lib/utils';

const browserClient = createBrowserClient(browser);
/**
 * Initialize new Client for browser instance only
 * @param shouldCreate boolean
 * @returns Apollo Client
 */
function createBrowserClient(shouldCreate: boolean) {
    if (shouldCreate) {
        return new ApolloClient({
            link: errorLink.concat(httpLink),
            cache: new InMemoryCache(),
            ssrForceFetchDelay: 100,
            connectToDevTools: dev,
        })
    }
    return undefined;
}

/**
 * Initialize new Client for server instance only
 * @param req PolkaRequest
 * @param res PolkaResponse
 * @returns Apollo Client
 */
function createServerClient(req: Request) {
    return new ApolloClient({
        credentials: "include",
        link: errorServerLink(req).concat(httpServerLink(req)),
        ssrMode: true,
        cache: new InMemoryCache(),
    });
}

/**
 * Initialize apollo client in browser using session cache
 * @param session Sapper session store
 */
function hydrateApolloClient(session: Session) {
    if (!browser && !isEmpty(session.apollo)) {
        onDestroy(() => {
            // Replace apollo client with its cache for serialization
            session.apollo = session.apollo.extract()
        })
    } 
    else if (browser) {
        // Restore the cache string back
        browserClient.restore(session.apollo as any)
        // At client-side, the `$session.apollo` should refer to the client-side version
        session.apollo = browserClient
    }
}


function getClient(currentClient: ApolloClient<any>) {
    if (browser) {
        return browserClient;
    }
    return currentClient;
}


export { browserClient, createServerClient, hydrateApolloClient, getClient };