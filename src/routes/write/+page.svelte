<script lang="ts">
	import BlogCard from '$lib/components/shared/BlogCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Portfolio - Writing</title>
	<meta name="description" content="Notes, ideas and articles." />
</svelte:head>

<section class="write-page">
	<header class="write-page__header">
		<span class="write-page__subtitle font-small">index / {data.posts.length}</span>
		<h1>Writing</h1>
	</header>

	{#if data.posts.length}
		<div class="write-page__grid">
			{#each data.posts as post (post.id)}
				<div class="write-page__item">
					<BlogCard item={post} />
				</div>
			{/each}
		</div>
	{:else}
		<p class="write-page__empty">Nothing published yet.</p>
	{/if}
</section>

<style>
	.write-page {
		margin-block: 128px;
	}

	.write-page__header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 64px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--color-primary);
	}

	.write-page__subtitle,
	.write-page__empty {
		color: var(--color-quaternary);
	}

	.write-page__grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 16px;

		@media (--viewport-md-up) {
			grid-template-columns: repeat(3, 1fr);
			gap: 24px;
		}
	}
</style>
