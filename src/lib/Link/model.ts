import { gql } from '@apollo/client/core';
import type { ApolloClient } from '@apollo/client/core';
import { readQuery } from '$lib/ApolloClient/query';

const createLink = gql`
    mutation createOrUpdateOneLink($link: LinkInsertInput!) {
        createOrUpdateOneLink(input: $link) {
            _id
            url
            shortLinks {
                _id
                campaign
                createdAt
                link {
                    _id
                }
                medium
                source
            }
        }
    }
`;

const linkInfo = gql`
    query shortLink($query: ShortLinkQueryInput!) {
        shortLink(query: $query) {
            _id
            campaign
            createdAt
            link {
                _id
                url
            }
            medium
            source
        }
    }
`;

const linksInfo = gql`
    query links($query: LinkQueryInput, $limit: Int = 100, $sortBy: LinkSortByInput = _ID_DESC) {
        links(query: $query, limit: $limit, sortBy: $sortBy) {
            _id
            url
            shortLinks {
                _id
                campaign
                createdAt
                link {
                    _id
                }
                medium
                source
            }
        }
    }
`;

type LinkInsertInput = {
    url: string,
    hash: string,
    shortLinks: {
        create: Array<{
            campaign?: string,
            createdAt: string,
            medium?: string,
            source?: string,
        }>,
    }
}

export const createNewLink = async (client: ApolloClient<any>, input: LinkInsertInput) => {
    return client.mutate({
        mutation: createLink,
        variables: {
            link: input,
        }
    });
}

type LinkQueryInput = {
    url?: string
}

export const loadLinks = async (client: ApolloClient<any>, query: LinkQueryInput = {}) => {
    let response = await client.query({
        query: linksInfo,
        variables: { query },
        fetchPolicy: 'network-only'
    });

    return response;
};

export const readLinks = (client: ApolloClient<any>, query: LinkQueryInput = {}) => {
    return readQuery(client, { query: linksInfo, variables: { query } });
}

type ShortLinkQueryInput = {
    _id: string
}

export const loadShortLink = async (client: ApolloClient<any>, query: ShortLinkQueryInput) => {
    return client.query({
        query: linkInfo,
        variables: { query },
        fetchPolicy: 'network-only'
    });
};