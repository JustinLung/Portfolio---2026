const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
});

export function formatShortDate(value: string | Date): string {
	return shortDateFormatter.format(typeof value === 'string' ? new Date(value) : value);
}
