<script lang="ts">
	import { tick } from 'svelte';
	import gsap from 'gsap';
	import { Flip } from 'gsap/Flip';
	import BlogCard from '$lib/components/shared/BlogCard.svelte';
	import Seo from '$lib/components/shared/Seo.svelte';
	import { playSfx } from '$lib/sfx';
	import type { PageProps } from './$types';

	gsap.registerPlugin(Flip);

	let { data }: PageProps = $props();

	let selectedCategory = $state('all');
	let gridRef: HTMLDivElement | null = null;
	let layoutAnimation: gsap.core.Timeline | null = null;
	let categories = $derived([...new Set(data.posts.map((post) => post.category))]);
	let filteredPosts = $derived(
		selectedCategory === 'all'
			? data.posts
			: data.posts.filter((post) => post.category === selectedCategory)
	);

	async function animateLayout(update: () => void) {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const currentItems = gridRef?.querySelectorAll('.write-page__item');
		layoutAnimation?.kill();

		if (currentItems?.length) {
			Flip.killFlipsOf(currentItems);
			gsap.set(currentItems, {
				clearProps:
					'position,top,left,width,height,maxWidth,maxHeight,minWidth,minHeight,transform,opacity'
			});
		}

		const state = !reduceMotion && currentItems?.length ? Flip.getState(currentItems) : null;

		update();
		await tick();

		if (!state || !gridRef) return;

		const nextItems = gridRef.querySelectorAll('.write-page__item');
		const cleanup = () => {
			gsap.set(nextItems, {
				clearProps:
					'position,top,left,width,height,maxWidth,maxHeight,minWidth,minHeight,transform,opacity'
			});
			layoutAnimation = null;
		};

		layoutAnimation = Flip.from(state, {
			targets: nextItems,
			duration: 0.45,
			ease: 'expo.out',
			prune: true,
			onEnter: (elements) =>
				gsap.fromTo(
					elements,
					{ opacity: 0, y: 12 },
					{ opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', stagger: 0.03 }
				),
			onComplete: cleanup,
			onInterrupt: cleanup
		});
	}

	function selectCategory(category: string) {
		if (selectedCategory === category) return;

		void animateLayout(() => {
			selectedCategory = category;
		});
		playSfx('select');
	}

	$effect(() => {
		return () => {
			layoutAnimation?.kill();
		};
	});
</script>

<Seo title="Writing" description="Notes, ideas and articles." />

<section class="write-page">
	<header class="write-page__header">
		<span class="write-page__subtitle font-small">index / {filteredPosts.length}</span>
		<h1>Writing</h1>
	</header>

	{#if categories.length > 1}
		<div class="write-page__filter">
			<label class="visually-hidden" for="write-category">Filter by category</label>
			<div class="write-page__select">
				<select
					id="write-category"
					value={selectedCategory}
					data-uisfx-hover="hover"
					onchange={(event) => selectCategory(event.currentTarget.value)}
				>
					<option value="all">All categories</option>
					{#each categories as category (category)}
						<option value={category}>{category}</option>
					{/each}
				</select>
				<svg viewBox="0 0 16 16" aria-hidden="true">
					<path d="M4 6.5 8 10.5 12 6.5" />
				</svg>
			</div>
		</div>
	{/if}

	{#if data.posts.length}
		<div bind:this={gridRef} class="write-page__grid">
			{#each filteredPosts as post (post.id)}
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
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--color-primary);
	}

	.write-page__filter {
		margin-bottom: 40px;
	}

	.write-page__select {
		position: relative;
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--color-primary);
		border-radius: 4px;
		background-color: var(--color-white);
		color: var(--color-primary);
		transition:
			color 250ms var(--easeOutExpo),
			background-color 250ms var(--easeOutExpo);

		select {
			appearance: none;
			height: 32px;
			padding-inline: 12px 36px;
			border: 0;
			background: none;
			color: inherit;
			font-family: inherit;
			font-size: 0.75rem;
			font-weight: 500;
			cursor: pointer;

			&:focus-visible {
				outline: none;
			}
		}

		/* Native dropdowns inherit the select's colors on some platforms. */
		option {
			background-color: var(--color-white);
			color: var(--color-primary);
		}

		svg {
			position: absolute;
			right: 12px;
			width: 16px;
			height: 16px;
			fill: none;
			stroke: currentColor;
			stroke-linecap: round;
			stroke-linejoin: round;
			stroke-width: 1.25;
			pointer-events: none;
		}

		&:has(select:focus-visible) {
			outline: 2px solid var(--color-primary);
			outline-offset: 2px;
		}

		&:hover {
			background-color: var(--color-primary);
			color: var(--color-white);
		}
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
			grid-template-columns: repeat(2, 1fr);
			gap: 24px;
		}

		@media (--viewport-lg-up) {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
