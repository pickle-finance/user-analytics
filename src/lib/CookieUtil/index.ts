import { config } from '$lib/config';
import cookie from 'cookie';
import type { CookieManager } from 'svelboost/src';


let accessTokenCookieName = config.accessTokenCookieName;
let refreshTokenCookieName = config.refreshTokenCookieName;

export function setAccessToken(manager: CookieManager, accessToken: string) {
    return manager.setCookie(accessTokenCookieName, accessToken, {
        path: '/',
        domain: config.appDomain,
        httpOnly: false,
        expires: new Date(new Date().getTime() + 30 * 60000)
    })
}

export function setRefreshToken(manager: CookieManager, refreshToken: string) {
    return manager.setCookie(refreshTokenCookieName, refreshToken, {
        path: '/',
        domain: config.appDomain,
        httpOnly: false,
    })
}

export function removeAccessToken(manager: CookieManager) {
    return manager.removeCookie(accessTokenCookieName, {
        path: '/',
        domain: config.appDomain,
        httpOnly: false,
        expires: Date.now()
    })
}

export function removeRefreshToken(manager: CookieManager) {
    return manager.removeCookie(refreshTokenCookieName, {
        path: '/',
        domain: config.appDomain,
        httpOnly: false,
        maxAge: 0
    })
}

export function serializeAccessToken(accessToken: string, options?: cookie.CookieSerializeOptions) {
    return cookie.serialize(accessTokenCookieName, accessToken, {
        path: '/',
        domain: config.appDomain,
        httpOnly: false,
        sameSite: "lax",
        expires: new Date(new Date().getTime() + 30 * 60000),
        ...options
    })
}

export function serializeRefreshToken(refreshToken: string, options?: cookie.CookieSerializeOptions) {
    return cookie.serialize(refreshTokenCookieName, refreshToken, {
        path: '/',
        domain: config.appDomain,
        httpOnly: false,
        sameSite: "lax",
        ...options
    })
}

export function serializeCookie(cookieName: string, value: string, options?: cookie.CookieSerializeOptions) {
    return cookie.serialize(cookieName, value, {
        path: '/',
        domain: config.appDomain,
        httpOnly: false,
        sameSite: "lax",
        ...options
    })
}

export function getRefreshToken(manager: CookieManager) {
    return manager.checkCookie(refreshTokenCookieName)
}