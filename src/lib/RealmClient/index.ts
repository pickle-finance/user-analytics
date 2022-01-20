import fetcher from './fetcher';
import { cleanArgsAndSerialize } from './utils';
import Credentials from './credentials';
import type { User } from './types';
import { config } from "$lib/config";

const appUrl = config.apiUrl + "/app/" + config.realmAppId;
const authUrl = config.apiUrl + "/auth";

export const routes = {
    functionsUrl: appUrl + "/functions/call",
    sessionUrl: authUrl + "/session",
    authProviderUrl: (providerName: string) => appUrl + `/auth/providers/${providerName}/login`
}
export interface RealmClientInterface {
    login(credentials: Credentials<any>): Promise<any>;
    loginAnonymous(credentials?: Credentials<any>): Promise<any>;
    userFunction(user: User, name: string, ...args: any[]): Promise<any>;
    refreshAccessToken(currentUser: User): Promise<any>;
    logout(currentUser: User): Promise<any>;
}
class RealmClient implements RealmClientInterface {
    login = async (credentials: Credentials<any>) => {
        let response = await fetcher({
            method: "POST",
            url: routes.authProviderUrl(credentials.providerName),
            body: credentials.payload,
            tokenType: "none",
        });
        let { userId, accessToken, refreshToken } = handleLogin(response);
        return {
            id: userId,
            accessToken: accessToken,
            refreshToken: refreshToken,
            providerType: credentials.providerType,
        };
    }

    loginAnonymous = async (credentials = Credentials.anonymous()) => {
        return this.login(credentials);
    }

    userFunction = async (user: User, name: string, ...args: any[]) => {
        const body = {
            name,
            arguments: cleanArgsAndSerialize(args),
        };
        return fetcher({
            user,
            method: "POST",
            url: routes.functionsUrl,
            body: body,
            tokenType: "access"
        });
    }

    refreshAccessToken = async (currentUser: User): Promise<User> => {
        const response = await fetcher({
            user: currentUser,
            method: "POST",
            url: routes.sessionUrl,
            tokenType: "refresh",
        }).catch(async () => {
            return this.loginAnonymous();
        });

        const { access_token: accessToken } = response;
        if (typeof accessToken === "string") {
            return { accessToken };
        } else {
            throw new Error("Expected an 'access_token' in the response");
        }
    }

    logout = async (currentUser: User) => {
        return fetcher({
            user: currentUser,
            method: "DELETE",
            url: routes.sessionUrl,
            tokenType: "refresh",
        })
    }
}

function handleLogin(response: any) {
    // Spread out values from the response and ensure they're valid
    const {
        user_id: userId,
        access_token: accessToken,
        refresh_token: refreshToken = null,
        device_id: deviceId,
    } = response;
    if (typeof userId !== "string") {
        throw new Error("Expected a user id in the response");
    }
    if (typeof accessToken !== "string") {
        throw new Error("Expected an access token in the response");
    }
    return { userId, accessToken, refreshToken, deviceId };
}

const realmClient = new RealmClient();
export default realmClient;