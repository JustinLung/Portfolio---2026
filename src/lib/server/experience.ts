import type { ExperienceFieldsFragment } from '$lib/graphql/generated/graphql';
import type { ExperienceItem } from '../../utils/types';

export function toExperienceItem(experience: ExperienceFieldsFragment): ExperienceItem {
	if (!experience.title) {
		throw new Error(`Experience "${experience.id}" is missing a title`);
	}

	const fields = experience.experienceFields;
	const startYear = fields?.startyear;

	if (startYear == null) {
		throw new Error(`Experience "${experience.id}" is missing a start year`);
	}

	return {
		id: experience.id,
		title: experience.title,
		role: fields?.role ?? '',
		startYear: String(Math.trunc(startYear)),
		endYear: fields?.endYear != null ? String(Math.trunc(fields.endYear)) : undefined,
		currentYear: fields?.currentyear ?? false,
		link: fields?.link ?? experience.uri ?? '#'
	};
}
