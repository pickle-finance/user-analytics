import { createNewLink } from "$lib/Link/model";
import { isEmpty } from "$lib/utils";

export async function post({ body, locals }) {
    if (isEmpty(body)) {
        return {
            status: 400,
            body: {
                error: "params are required"
            }
        }
    }

    let hash = getShortHash(body.url).toString(16);
    return createNewLink(locals.apolloClient, {
        url: body.url,
        hash,
        shortLinks: {
            create: [{
                ...body.shortLinkProps,
                createdAt: new Date().getTime().toString()
            }]
        }
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