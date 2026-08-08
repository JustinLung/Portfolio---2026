<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { onMount } from 'svelte';
	import HeroRoseScene from './HeroRoseScene.svelte';

	let { title, subtitle }: { title: string; subtitle: string } = $props();

	let pointerX = $state(0);
	let pointerY = $state(0);
	let pointerActive = $state(false);
	let reducedMotion = $state(false);
	let pixelRatio = $state(1);

	const handlePointerMove = (event: PointerEvent) => {
		const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
		pointerX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
		pointerY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
		pointerActive = true;
	};

	const resetPointer = () => {
		pointerX = 0;
		pointerY = 0;
		pointerActive = false;
	};

	onMount(() => {
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updateMotionPreference = () => {
			reducedMotion = motionQuery.matches;
		};

		pixelRatio = Math.min(window.devicePixelRatio, 1.75);
		updateMotionPreference();
		motionQuery.addEventListener('change', updateMotionPreference);

		return () => motionQuery.removeEventListener('change', updateMotionPreference);
	});
</script>

<!-- Pointer movement only decorates the scene; there is no keyboard-equivalent action. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section class="hero" onpointermove={handlePointerMove} onpointerleave={resetPointer}>
	<div class="hero__scene" aria-hidden="true">
		<Canvas dpr={pixelRatio}>
			<HeroRoseScene {pointerX} {pointerY} {pointerActive} {reducedMotion} />
		</Canvas>
	</div>
	<div class="hero__content">
		<span class="hero__subtitle">{subtitle}</span>
		<h1 class="hero__title">{title}</h1>
	</div>
</section>

<style>
	.hero {
		position: relative;
		left: calc(50% - 50vw);
		isolation: isolate;
		display: flex;
		flex-direction: column;
		width: 100vw;
		min-height: 85svh;
		overflow: hidden;
		background: var(--color-neutral-900);

		@media (--viewport-lg-up) {
			min-height: 100svh;
		}

		.hero__scene {
			position: absolute;
			z-index: 0;
			top: 0;
			left: 50%;
			width: 100vw;
			height: 100%;
			transform: translateX(-50%);
			cursor: grab;

			&:active {
				cursor: grabbing;
			}

			&::after {
				position: absolute;
				inset: 0;
				background: linear-gradient(90deg, rgb(12 5 7 / 0.35), transparent 42%);
				content: '';
				pointer-events: none;
			}
		}

		.hero__content {
			position: relative;
			z-index: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: flex-start;
			flex: 1;
			padding-inline: max(16px, calc((100vw - 1408px) / 2));
			padding-bottom: 32px;
		}
	}
</style>
