<script lang="ts">
	import type { SeoProps } from '../../../utils/types';

	const DEFAULT_KEYWORDS =
		'Justin, Creative Coder, Amsterdam, GSAP, Framer Motion, Next.js, SvelteKit';

	let {
		title,
		description,
		keywords = DEFAULT_KEYWORDS,
		author = 'Justin',
		robots = 'index, follow'
	}: SeoProps = $props();

	const documentTitle = $derived(`Portfolio | ${title}`);

	const plainDescription = $derived(
		description
			? description
					.replace(/<[^>]*>/g, ' ')
					.replace(/\s+/g, ' ')
					.trim()
			: undefined
	);
</script>

<!--
	@component
	Sets document title and shared SEO meta tags for a route.
	Titles are formatted as `Portfolio | {title}`.
-->
<svelte:head>
	<title>{documentTitle}</title>
	{#if plainDescription}
		<meta name="description" content={plainDescription} />
	{/if}
	<meta name="keywords" content={keywords} />
	<meta name="author" content={author} />
	<meta name="robots" content={robots} />
	<meta property="og:title" content={documentTitle} />
	<meta property="og:description" content={plainDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://justinlung.com" />
	<meta property="og:image" content="/images/justin.avif" />
	<meta property="og:image:alt" content="Justin Lung" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/avif" />
</svelte:head>
