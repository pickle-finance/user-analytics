import { isEmpty } from "$lib/utils";
import realmClient from '$lib/RealmClient';
import { CookieManager } from 'svelboost/src';
import { removeAccessToken, removeRefreshToken } from '$lib/CookieUtil';

import type { ApolloClient } from '@apollo/client/core';
import type { Writable } from 'svelte/store';
import type { User } from '$lib/RealmClient/types';

class AuthComponent {
    async request() {
        return realmClient.loginAnonymous();
    }

    isLoggedIn(currentUser?: any) {
        return !isEmpty(currentUser);
    }

    async logout(currentUser: User, onSuccess: any, onFailure: any) {
        return realmClient.logout(currentUser).then(() => {
            let cookieManager = new CookieManager();

            removeAccessToken(cookieManager);
            removeRefreshToken(cookieManager);

            return onSuccess();
        }).catch(err => onFailure(err))
    }

    async refetch(client: ApolloClient<any>, session: Writable<Session>) {
        const user = await this.request();
        session.update(s => ({ ...s, currentUser: user }));
        return user;
    }
}

const auth = new AuthComponent();

export default auth;