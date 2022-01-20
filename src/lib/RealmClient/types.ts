type User = {
    id?: string;
    providerType?: any;
    accessToken?: string;
    refreshToken?: string;
}

type AuthenticatedRequest = {
    url?: string,
    method: "POST" | "GET" | "DELETE",
    headers?: any;
    body?: any
    /**
     * Which token should be used when requesting?
     *
     * @default "access"
     */
    tokenType?: TokenType;
    user?: User;
};

type AuthenticatedResponse = {
    headers: any;
    ok: boolean;
    redirected: boolean;
    status: number;
    statusText: string;
    url: string;
    json(): Promise<any>;
}

type TokenType = "access" | "refresh" | "none";

export type {
    AuthenticatedRequest,
    AuthenticatedResponse,
    TokenType,
    User
}