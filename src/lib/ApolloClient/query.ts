import { observableQueryToWritable, observableToWritable } from "./observable";
import type { WritableQuery, WritableResult } from "./observable";
import type { ApolloClient, SubscriptionOptions, WatchQueryOptions } from '@apollo/client/core';

// TODO: Test this and use as a replacement of getQuery
export function readQuery<TData>(client: ApolloClient<any>, options: WatchQueryOptions<any, TData>): WritableQuery<TData> {
    let initialValue: TData | undefined;
    try {
        // undefined = skip initial value (not in cache)
        initialValue = client.readQuery(options) || undefined;
    } catch (err) {
        // Ignore preload errors
    }

    const observable = client.watchQuery<TData>(options);
    const store = observableQueryToWritable(
        observable,
        initialValue !== undefined
            ? ({
                data: initialValue,
            } as Data<TData>)
            : undefined
    );

    return store;
}

export function subscribeQuery<TData>(client: ApolloClient<any>, options: SubscriptionOptions<any, TData>): WritableResult<TData> {
    const observable = client.subscribe<TData>(options);

    return observableToWritable<TData>(observable);
};