type ProviderType = "api-key" | "custom-function" | "anon-user";

type ApiKeyPayload = {
    key: string;
};

type FunctionPayload = object;

type AnonymousPayload = any;

/**
 * Instances of this class can be passed to the `app.logIn` method to authenticate an end-user.
 */
class Credentials<PayloadType extends object = any> {
    /**
     * Name of the authentication provider.
     */
    readonly providerName: string;

    /**
     * Type of the authentication provider.
     */
    readonly providerType: ProviderType;

    /**
     * A simple object which can be passed to the server as the body of a request to authenticate.
     */
    readonly payload: PayloadType;

    constructor(name: string, type: "api-key", payload: ApiKeyPayload);
    constructor(name: string, type: "anon-user", payload: AnonymousPayload);
    constructor(
        name: string,
        type: "custom-function",
        payload: FunctionPayload,
    );

    constructor(
        providerName: string,
        providerType: ProviderType,
        payload: PayloadType,
    ) {
        this.providerName = providerName;
        this.providerType = providerType;
        this.payload = payload;
    }

    /**
      * Creates credentials that logs in using the [Anonymous Provider](https://docs.mongodb.com/realm/authentication/anonymous/).
      *
      * @returns The credentials instance, which can be passed to `app.logIn`.
      */
    static anonymous(): Credentials<AnonymousPayload> {
        return new Credentials<AnonymousPayload>("anon-user", "anon-user", {});
    }

    /**
     * Factory for `Credentials` which authenticate using the [API Key Provider](https://docs.mongodb.com/realm/authentication/api-key/).
     *
     *
     * @param key The secret content of the API key.
     * @returns A `Credentials` object for logging in using `app.logIn`.
     */
    static apiKey(key: string) {
        return new Credentials<ApiKeyPayload>("api-key", "api-key", { key });
    }
    /**
     * Factory for `Credentials` which authenticate using the [Custom Function Provider](https://docs.mongodb.com/realm/authentication/custom-function/).
     *
     * @param payload The custom payload as expected by the server.
     * @returns A `Credentials` object for logging in using `app.logIn`.
     */
    static function<PayloadType extends FunctionPayload = FunctionPayload>(
        payload: PayloadType,
    ) {
        return new Credentials(
            "custom-function",
            "custom-function",
            payload,
        );
    }
}

export default Credentials;