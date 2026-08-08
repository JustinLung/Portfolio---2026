import { env } from '$env/dynamic/private';
import { WorksDocument } from '$lib/graphql/generated/graphql';
import { createApolloClient } from '$lib/server/apollo';
import { sortWorksByYearDesc, toWorkItem } from '$lib/server/work';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const endpoint = env.WORDPRESS_GRAPHQL_URL;

	if (!endpoint) {
		error(500, 'WORDPRESS_GRAPHQL_URL is not configured');
	}

	const client = createApolloClient(endpoint, fetch);

	try {
		const { data } = await client.query({
			query: WorksDocument,
			fetchPolicy: 'no-cache'
		});

		if (!data?.works) {
			throw new Error('WordPress returned no work data');
		}

		return {
			works: sortWorksByYearDesc(data.works.nodes.map(toWorkItem))
		};
	} catch (cause) {
		console.error('Failed to fetch works from WordPress', cause);
		error(502, 'Unable to load work from WordPress');
	}
};
