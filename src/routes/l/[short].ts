import PostHog from 'posthog-node';
import { config } from "$lib/config";
import { serializeCookie } from '$lib/CookieUtil';
import { CookieManager } from 'svelboost/src';
import { v4 } from 'uuid';

export async function get({ params, headers }) {
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
        response.body.error = "No params provided";
        return response;
    }

    let { error, data } = await fetch(`${config.appHost}/links/${params.short}`, { credentials: "include" }).then(res => res.json());
    if (error) {
        response.status = 400;
        response.body.error = error;
        return response;
    } else {
        const client = new PostHog(config.posthog.token, { host: config.posthog.host });
        const cookieManager = new CookieManager(headers.cookie);

        const props = data.shortLink;
        const userId = cookieManager.checkCookie(config.posthog.cookieName);
        const genUserId = v4();
        client.capture({
            distinctId: userId || genUserId,
            event: config.posthog.eventName,
            properties: {
                campaign: props.campaign,
                source: props.source,
                medium: props.medium,
                url: props.link.url
            }
        });

        client.shutdown();

        response.status = 301;
        response.headers = Object.assign(response.headers, {
            Location: props.link.url,
            ...(userId ? {} : {
                "Set-Cookie": serializeCookie(config.posthog.cookieName, genUserId)
            })
        });
        return response;
    }
}