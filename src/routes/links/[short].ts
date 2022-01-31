import { loadShortLink } from "$lib/Link/model";

export async function get({ params, locals }) {
    let response = {
        status: 200,
        body: {
            data: null,
            error: null
        },
        headers: {
            "Content-Type": "application/json",
        }
    }

    if (!params.short) {
        response.status = 400;
        response.body.error = "No short link provided";

        return response;
    }

    let { error, data } = await loadShortLink(locals.apolloClient, { _id: params.short }).catch((err) => ({ error: err, data: null }));
    if (error) {
        response.status = 400;
        response.body.error = error;
        return response;
    } else {
        response.status = 200;
        response.body.data = data;
        response.headers = Object.assign(response.headers, {
            "Cache-Control": `s-maxage=1440, stale-while-revalidate`
        });

        return response;
    }
}