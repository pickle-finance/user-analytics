import realmClient from "$lib/RealmClient";
import { config } from "$lib/config";
import { CookieManager } from 'svelboost/src';

// TODO: add enhancement to validate the accessToken using Realm Admin API
async function getValidAccessToken(cookies?: string) {
    let cookieManager = new CookieManager(cookies);

    let accessToken = cookieManager.getCookie(config.accessTokenCookieName);
    let refreshToken = cookieManager.getCookie(config.refreshTokenCookieName);

    if (accessToken && accessToken !== "undefined") {
        return [accessToken, false];
    } else if (refreshToken && refreshToken !== "undefined") {
        cookieManager.removeCookie(config.accessTokenCookieName);
        let user = await realmClient.refreshAccessToken({ refreshToken });
        return [user.accessToken, true, user?.refreshToken];
    } else {
        let user = await realmClient.loginAnonymous();
        return [user.accessToken, true, user?.refreshToken];
    }
}

export default getValidAccessToken;