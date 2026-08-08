import { env } from '$env/dynamic/private';
import {
	GetHomePageDocument,
	WorksDocument,
	type GetHomePageQuery,
	type WorksQuery
} from '$lib/graphql/generated/graphql';
import { createApolloClient } from '$lib/server/apollo';
import { toHomePage } from '$lib/server/home';
import { sortWorksByYearDesc, toWorkItem } from '$lib/server/work';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const endpoint = env.WORDPRESS_GRAPHQL_URL;

	if (!endpoint) {
		error(500, 'WORDPRESS_GRAPHQL_URL is not configured');
	}

	const client = createApolloClient(endpoint, fetch);
	let page: GetHomePageQuery['page'];
	let works: WorksQuery['works'];

	try {
		const [{ data: pageData }, { data: worksData }] = await Promise.all([
			client.query({
				query: GetHomePageDocument,
				fetchPolicy: 'no-cache'
			}),
			client.query({
				query: WorksDocument,
				fetchPolicy: 'no-cache'
			})
		]);

		page = pageData?.page ?? null;
		works = worksData?.works ?? null;
	} catch (cause) {
		console.error('Failed to fetch home page from WordPress', cause);
		error(502, 'Unable to load home page from WordPress');
	}

	if (!page) {
		error(404, 'Home page not found');
	}

	if (!works) {
		error(502, 'Unable to load latest work from WordPress');
	}

	return {
		page: toHomePage(page),
		works: sortWorksByYearDesc(works.nodes.map(toWorkItem)).slice(0, 6)
	};
};
