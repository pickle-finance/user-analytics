import { createNewLink } from "$lib/Link/model";

export async function post({ body, locals }) {
    let shortLink = getShortHash(body.url).toString(16);
    return createNewLink(locals.apolloClient, {
        url: body.url,
        short: shortLink,
        createdAt: new Date().getTime().toString()
    }).then(res => {
        return {
            status: 200,
            body: res
        }
    }).catch(err => {
        return {
            status: 500,
            body: err
        }
    });
}


function getShortHash(url: string) {
    var hash = 5381,
        i = url.length;

    while (i) {
        hash = (hash * 33) ^ url.charCodeAt(--i);
    }
    return hash >>> 0;
}