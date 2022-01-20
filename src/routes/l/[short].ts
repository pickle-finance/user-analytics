import { loadLink } from "$lib/Link/model";

export async function get({ params, locals }) {

    if (!params.short) {
        return {
            status: 400,
            body: {
                error: "No params provided"
            }
        }
    }


    return loadLink(locals.apolloClient, { short: params.short })
        .then(res => {
            if (res?.data?.link) {
                return {
                    status: 302,
                    headers: {
                        Location: res.data.link.url
                    }
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