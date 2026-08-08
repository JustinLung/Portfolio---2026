<script lang="ts">
	import RelatedPostsCarousel from '$lib/components/shared/RelatedPostsCarousel.svelte';
	import Seo from '$lib/components/shared/Seo.svelte';
	import WriteHero from '$lib/components/shared/WriteHero.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Seo title={data.post.title} description={data.post.excerpt ?? data.post.title} />

<article class="post" aria-labelledby="post-title">
	<WriteHero
		image={data.post.image}
		imageAlt={data.post.imageAlt}
		title={data.post.title}
		category={data.post.category}
		date={data.post.date}
	/>

	{#if data.post.content}
		<div class="post__content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- Content comes from the trusted WordPress CMS. -->
			{@html data.post.content}
		</div>
	{/if}
</article>

<RelatedPostsCarousel posts={data.relatedPosts} />

<style>
	.post {
		margin-block: 64px 128px;
	}

	.post__content {
		max-width: 44rem;
		margin-inline: auto;
	}

	.post__content :global(p) {
		font-size: 1rem;
	}

	.post__content :global(img) {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 4px;
	}

	.post__content :global(a) {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
</style>
