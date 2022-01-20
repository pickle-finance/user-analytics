import { loadLink } from "$lib/Link/model";

export async function get({ params, locals }) {
    return loadLink(locals.apolloClient, { short: params.short })
        .then(res => {
            if (res?.data?.link) {
                return {
                    status: 302,
                    location: res.data.link.url
                }
            }
        })
        .catch(err => {
            return {
                status: 500,
                body: err
            }
        });
}