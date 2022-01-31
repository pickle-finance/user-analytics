import getValidAccessToken from "$lib/ApolloClient/authTokens";
import { serializeAccessToken, serializeRefreshToken } from "$lib/CookieUtil";

export async function get({ headers }) {
    let customHeaders = {};
    let [accessToken, shouldUpdateCookie, newRefreshToken] = await getValidAccessToken(headers.cookie);

    if (shouldUpdateCookie) {
        if (newRefreshToken) {
            customHeaders = {
                'Set-Cookie': [
                    serializeAccessToken(accessToken),
                    serializeRefreshToken(newRefreshToken)
                ]
            }
        } else {
            customHeaders = {
                'Set-Cookie': serializeAccessToken(accessToken)
            }
        }
    }

    return {
        status: 200,
        body: {
            accessToken
        },
        headers: {
            ...headers,
            customHeaders
        }
    }
}