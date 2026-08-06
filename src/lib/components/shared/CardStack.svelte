<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	import type { CardStackProps } from '../../../utils/types';

	const { title = 'Captured moments', cardImages }: CardStackProps = $props();

	gsap.registerPlugin(ScrollTrigger);

	let cards: HTMLElement[];
	let rotations = [-12, 10, -5, 5, -5, -2];
	let totalCards: number;
	let progressPerCard: number;

	const setupCards = () => {
		cards = gsap.utils.toArray('.card') as HTMLElement[];
		totalCards = cards.length;
		progressPerCard = 1 / totalCards;

		cards.forEach((card, index) => {
			gsap.set(card, {
				y: window.innerHeight,
				rotate: rotations[index] || 0
			});
		});
	};

	const updateCardPositions = (progress: number) => {
		cards.forEach((card, index) => {
			const cardStart = index * progressPerCard;
			let cardProgress = (progress - cardStart) / progressPerCard;
			cardProgress = Math.min(Math.max(cardProgress, 0), 1);

			let yPos = window.innerHeight * (1 - cardProgress);
			let xPos = 0;

			if (cardProgress === 1 && index < totalCards - 1) {
				const remainingProgress =
					(progress - (cardStart + progressPerCard)) / (1 - (cardStart + progressPerCard));

				if (remainingProgress > 0) {
					const distanceMultiplier = 1 - index * 0.15;
					xPos = -window.innerWidth * 0.3 * distanceMultiplier * remainingProgress;
					yPos = -window.innerHeight * 0.3 * distanceMultiplier * remainingProgress;
				}
			}

			gsap.to(card, {
				y: yPos,
				x: xPos,
				duration: 0,
				ease: 'none'
			});
		});
	};

	onMount(() => {
		gsap.ticker.lagSmoothing(0);

		setupCards();

		ScrollTrigger.create({
			trigger: '.sticky-cards',
			start: 'top top',
			end: `+=${window.innerHeight + 8}px`,
			pin: true,
			pinSpacing: true,
			scrub: 1,
			onUpdate: (self) => {
				const progress = self.progress;
				updateCardPositions(progress);
			}
		});

		const handleResize = () => {
			setupCards();
		};

		onDestroy(() => {
			window.removeEventListener('resize', handleResize);
		});
	});
</script>

<section class="sticky-cards">
	<h2 class="sticky-cards__title">{title}</h2>
	{#each cardImages as image (image.url)}
		<div class="card">
			<div class="card-image">
				<img src={image.url} alt={image.alt} />
			</div>
		</div>
	{/each}
</section>

<style>
	.sticky-cards {
		position: relative;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		margin-bottom: 128px;

		.sticky-cards__title {
			font-size: clamp(2rem, 5vw, 5rem);
			color: var(--color-white);
		}

		.card {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			will-change: transform;
			width: 25%;
			height: 50%;
			padding: 8px;
			display: flex;
			flex-direction: column;
			gap: 8px;
			background-color: var(--color-neutral-900);
			color: var(--white);

			@media (--viewport-lg-down) {
				width: 75%;
			}
		}

		.card-image {
			flex: 1 1 0;
			min-height: 0;
			width: 100%;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				overflow: hidden;
			}
		}
	}
</style>
