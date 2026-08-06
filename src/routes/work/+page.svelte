<script lang="ts">
	import WorkList from '$lib/components/shared/WorkList.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Portfolio - Work</title>
	<meta name="description" content="Work" />
</svelte:head>

<section class="work-page">
	<header class="work-page__header">
		<span class="work-page__subtitle font-small">index / {data.works.length}</span>
		<h1 class="work-page__title">Work</h1>
	</header>
	{#if data.works.length > 0}
		<WorkList items={data.works} />
	{:else}
		<p class="work-page__empty">No works found</p>
	{/if}
</section>

<style>
	.work-page {
		margin-block: 128px;
		
		.work-page__title {
			margin-bottom: 16px;
		}
	}

	.work-page__empty {
		color: var(--color-quaternary);
	}
</style>
