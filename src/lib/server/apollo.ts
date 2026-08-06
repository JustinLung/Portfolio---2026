import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export function createApolloClient(uri: string, fetch: typeof globalThis.fetch) {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: new HttpLink({ uri, fetch })
	});
}
