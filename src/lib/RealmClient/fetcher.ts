import axios from 'axios';
import { deserialize } from './utils';
import type { TokenType, AuthenticatedRequest } from './types';

async function fetcher(request: AuthenticatedRequest): Promise<any> {
    const { body, user, tokenType, ...restOfRequest } = request;
    try {
        const response = await axios({
            withCredentials: true,
            data: body,
            ...restOfRequest,
            headers: {
                "Content-Type": "application/json",
                ...buildAuthorizationHeader(user, tokenType),
                Accept: "application/json",
                ...restOfRequest.headers,
            },
        });
        return deserialize(response.data);
    } catch (error) {
        console.error('request failed', error);
        throw error;
    }
}

function buildAuthorizationHeader(
    user: any | null,
    tokenType: TokenType,
): any {
    if (!user || tokenType === "none") {
        return {};
    } else if (tokenType === "access") {
        return { Authorization: `Bearer ${user.accessToken}` };
    } else {
        return { Authorization: `Bearer ${user.refreshToken}` };
    }
}

export default fetcher;