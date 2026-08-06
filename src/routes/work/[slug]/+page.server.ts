import { env } from '$env/dynamic/private';
import {
	WorkDocument,
	type WorkFieldsFragment
} from '$lib/graphql/generated/graphql';
import { createApolloClient } from '$lib/server/apollo';
import { toWorkItem } from '$lib/server/work';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const endpoint = env.WORDPRESS_GRAPHQL_URL;

	if (!endpoint) {
		error(500, 'WORDPRESS_GRAPHQL_URL is not configured');
	}

	const client = createApolloClient(endpoint, fetch);
	let work: WorkFieldsFragment | null;

	try {
		const { data } = await client.query({
			query: WorkDocument,
			variables: { slug: params.slug },
			fetchPolicy: 'no-cache'
		});

		work = data?.work ?? null;
	} catch (cause) {
		console.error(`Failed to fetch WordPress work "${params.slug}"`, cause);
		error(502, 'Unable to load work from WordPress');
	}

	if (!work) {
		error(404, 'Work not found');
	}

	return {
		work: toWorkItem(work)
	};
};
