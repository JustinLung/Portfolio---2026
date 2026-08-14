<script lang="ts">
	import { Canvas } from '@threlte/core';
	import gsap from 'gsap';
	import { appReady } from '$lib/stores/app-ready.svelte';
	import HeroRoseScene from './HeroRoseScene.svelte';

	let { title, subtitle }: { title: string; subtitle: string } = $props();

	let pointerX = $state(0);
	let pointerY = $state(0);
	let pointerActive = $state(false);
	let pointerDown = $state(false);
	let reducedMotion = $state(false);
	let pixelRatio = $state(1);
	const reveal = { scale: 0 };
	let entrancePlayed = false;
	let activePointerId: number | null = null;
	let heroElement: HTMLElement | null = null;

	const updatePointerPosition = (event: PointerEvent) => {
		const bounds = heroElement?.getBoundingClientRect();
		if (!bounds) return;

		pointerX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
		pointerY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
		pointerActive = true;
	};

	const handlePointerMove = (event: PointerEvent) => {
		if (activePointerId !== null && event.pointerId !== activePointerId) return;
		updatePointerPosition(event);
	};

	const handlePointerDown = (event: PointerEvent) => {
		if (
			reducedMotion ||
			!event.isPrimary ||
			(event.pointerType === 'mouse' && event.button !== 0)
		) {
			return;
		}

		const target = event.currentTarget as HTMLElement;
		updatePointerPosition(event);
		activePointerId = event.pointerId;
		pointerDown = true;
		target.setPointerCapture(event.pointerId);
	};

	const resetPointer = () => {
		if (pointerDown) return;
		pointerX = 0;
		pointerY = 0;
		pointerActive = false;
	};

	const cancelActiveDrag = (reset = false) => {
		if (
			activePointerId !== null &&
			heroElement?.hasPointerCapture(activePointerId)
		) {
			heroElement.releasePointerCapture(activePointerId);
		}

		activePointerId = null;
		pointerDown = false;
		if (reset) resetPointer();
	};

	const handlePointerEnd = (event: PointerEvent) => {
		if (event.pointerId !== activePointerId) return;
		cancelActiveDrag(event.type === 'pointercancel');
	};

	const handleLostPointerCapture = (event: PointerEvent) => {
		if (event.pointerId !== activePointerId) return;
		activePointerId = null;
		pointerDown = false;
	};

	function animateHero(section: HTMLElement) {
		heroElement = section;
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updateMotionPreference = () => {
			reducedMotion = motionQuery.matches;
			if (reducedMotion) cancelActiveDrag();
		};

		pixelRatio = Math.min(window.devicePixelRatio, 1.75);
		updateMotionPreference();
		motionQuery.addEventListener('change', updateMotionPreference);

		$effect(() => {
			if (!appReady.ready || entrancePlayed) return;

			entrancePlayed = true;
			const context = gsap.context(() => {
				if (motionQuery.matches) {
					reveal.scale = 1;
					gsap.set(['.hero__subtitle', '.hero__title'], {
						autoAlpha: 1,
						yPercent: 0
					});
					return;
				}

				gsap.set('.hero__subtitle', { autoAlpha: 0, yPercent: 35 });
				gsap.set('.hero__title', { autoAlpha: 0, yPercent: 24 });

				gsap
					.timeline()
					.to(reveal, {
						scale: 1,
						duration: 1.35,
						ease: 'expo.out'
					})
					.to('.hero__subtitle', {
						autoAlpha: 1,
						yPercent: 0,
						duration: 0.65,
						ease: 'expo.out'
					})
					.to(
						'.hero__title',
						{
							autoAlpha: 1,
							yPercent: 0,
							duration: .35,
							ease: 'expo.out'
						},
						'-=0.35'
					);
			}, section);

			return () => context.revert();
		});

		return () => {
			cancelActiveDrag();
			heroElement = null;
			motionQuery.removeEventListener('change', updateMotionPreference);
		};
	}
</script>

<!-- Pointer movement only decorates the scene; there is no keyboard-equivalent action. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
	class="hero"
	{@attach animateHero}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerEnd}
	onpointercancel={handlePointerEnd}
	onpointerleave={resetPointer}
	onlostpointercapture={handleLostPointerCapture}
>
	<div
		class:hero__scene--dragging={pointerDown && !reducedMotion}
		class="hero__scene"
		aria-hidden="true"
	>
		<Canvas dpr={pixelRatio}>
			<HeroRoseScene
				{pointerX}
				{pointerY}
				{pointerActive}
				{pointerDown}
				{reducedMotion}
				{reveal}
			/>
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
		touch-action: pan-y;

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

			&.hero__scene--dragging {
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

		.hero__subtitle,
		.hero__title {
			visibility: hidden;

			@media (prefers-reduced-motion: reduce) {
				visibility: visible;
			}
		}
	}
</style>
