<script lang="ts">
	import CardStack from '$lib/components/shared/CardStack.svelte';
	import About from '$lib/components/shared/About.svelte';
	import Experiences from '$lib/components/shared/Experiences.svelte';
	import Seo from '$lib/components/shared/Seo.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Seo title={data.page.title} description={data.page.content} />

<About
	title={data.page.title}
	content={data.page.content}
	src={data.page.image ?? '/images/justin.avif'}
	alt={data.page.imageAlt}
/>
<Experiences items={data.experiences} />
{#if data.page.cardImages.length}
	<CardStack title="My life through a lens" cardImages={data.page.cardImages} />
{/if}
