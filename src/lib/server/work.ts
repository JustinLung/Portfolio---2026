import type { WorkFieldsFragment } from '$lib/graphql/generated/graphql';
import type { WorkItem } from '../../utils/types';

export function toWorkItem(work: WorkFieldsFragment): WorkItem {
	if (!work.slug || !work.title || !work.date) {
		throw new Error(`Work "${work.id}" is missing a slug, title, or date`);
	}

	const year = Number.parseInt(work.date.slice(0, 4), 10);
	const categories = (work.categories?.nodes ?? []).flatMap(({ id, name, slug }) =>
		name && slug ? [{ id, name, slug }] : []
	);
	const categoryNames = categories.map((category) => category.name);
	const roles = work.workFields?.role?.filter((role): role is string => Boolean(role)) ?? [];
	const workplaces = work.workFields?.at?.filter((at): at is string => Boolean(at)) ?? [];

	return {
		id: work.id,
		slug: work.slug,
		url: `/work/${work.slug}`,
		title: work.title,
		category: categoryNames.join(', ') || 'Work',
		categories,
		year: Number.isNaN(year) ? 0 : year,
		date: work.date,
		content: work.content ?? undefined,
		excerpt: work.workFields?.excerpt ?? undefined,
		siteUrl: work.workFields?.siteUrl ?? undefined,
		githubUrl: work.workFields?.githubUrl ?? undefined,
		role: roles.join(', ') || undefined,
		at: workplaces.join(', ') || undefined,
		image: work.featuredImage?.node.sourceUrl ?? undefined,
		imageAlt: work.featuredImage?.node.altText || work.title
	};
}
