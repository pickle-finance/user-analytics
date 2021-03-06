import { Observable } from "@apollo/client/core";
import type { GraphQLError } from "graphql";

type DefaultResponse<Data> = {
    errors?: ReadonlyArray<GraphQLError>,
    data: Data
}

type BaseHandler<T extends any> = {
    data?: T | null,
    error?: GraphQLError | null
}

type Handler<T extends any> = (handler: BaseHandler<T>) => BaseHandler<T> | any


function responseHandler<QueryResponse>(response: DefaultResponse<QueryResponse>, queryName: string, onSuccess?: Handler<QueryResponse>, onError?: Handler<QueryResponse>): BaseHandler<QueryResponse> {
    if (Array.isArray(response.errors)) {
        if (onError) {
            return onError({ error: response.errors[0] });
        }
        return { error: response.errors[0], data: null };
    } else {
        if (onSuccess) {
            return onSuccess({ data: queryName ? response.data[queryName] : response.data })
        }
        return { error: null, data: queryName ? response.data[queryName] : response.data }
    }
}

// Convert promise like object to observable
export let promiseToObservable = (promise: Promise<any>) =>
    new Observable(observer => {
        promise.then(data => {
            if (observer.closed) return;
            observer.next(data);
            observer.complete();
        }).catch(err => observer.error(err));
    });

export default responseHandler;
