import { createServerClient } from "$lib/ApolloClient";
import type { GetSession, Handle } from "@sveltejs/kit";
import { sequence } from '@sveltejs/kit/hooks';


export const getSession: GetSession = (request) => {
    return {
        user: request?.locals?.currentUser,
        apollo: request?.locals?.apolloClient,
    }
}

const apolloClient: Handle = async ({ request, resolve }) => {
    request.locals.apolloClient = createServerClient();
    let response = await resolve(request);

    return response;
}

export const handle = sequence(apolloClient)