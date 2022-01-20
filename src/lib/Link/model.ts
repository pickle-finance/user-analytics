import { gql } from '@apollo/client/core';
import type { ApolloClient } from '@apollo/client/core';
import { readQuery } from '$lib/ApolloClient/query';
import { config } from '$lib/config';


const createLink = gql`
    mutation insertOneLink($link: LinkInsertInput!) {
        insertOneLink(data: $link) {
            short
            url
            domain
            createdAt
        }
    }
`;

const linkInfo = gql`
    query link($query: LinkQueryInput!) {
        link(query: $query) {
            short
            url
            domain
            createdAt
        }
    }
`;

type LinkInsertInput = {
    url: string,
    short: string,
    createdAt: string
    domain?: string,
}

export const createNewLink = async (client: ApolloClient<any>, input: LinkInsertInput) => {
    return client.mutate({
        mutation: createLink,
        variables: {
            link: {
                ...input,
                domain: config.appHost + "/l/"
            }
        }
    });
}

type LinkQueryInput = {
    url?: string,
    short?: string
}

export const loadLink = async (client: ApolloClient<any>, query: LinkQueryInput) => {
    let response = await client.query({
        query: linkInfo,
        variables: { query },
        fetchPolicy: 'network-only'
    });

    return response;
};

export const readLink = async (client: ApolloClient<any>, query: LinkQueryInput) => {
    return readQuery(client, { query: linkInfo, variables: { query } });
}