<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import gsap from 'gsap';
	import { links, socialLinks } from '../../../utils/links';
	import { MediaQuery } from 'svelte/reactivity';
	import { playSfx } from '$lib/sfx.svelte';
	import SoundToggle from '../shared/ui/SoundToggle.svelte';

	const DRAG_THRESHOLD = 6;
	const CLOSE_DISTANCE = 0.25;
	const CLOSE_VELOCITY = 0.5;

	let menuOpen = $state(false);
	let navigation: HTMLElement;
	let backdrop: HTMLElement;
	let menuButton: HTMLButtonElement;
	let initialized = false;

	let drag: {
		pointerId: number;
		startY: number;
		lastY: number;
		lastTime: number;
		velocity: number;
		height: number;
		active: boolean;
	} | null = null;
	let suppressClick = false;
	let setSheetY: (value: number) => void;
	let setBackdropOpacity: (value: number) => void;

	// Mirrors --viewport-md-up in src/lib/css/media.css.
	const desktop = new MediaQuery('min-width: 48em');
	const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function toggleMenu() {
		menuOpen = !menuOpen;
		playSfx(menuOpen ? 'open' : 'close');
	}

	function closeMenu() {
		if (!menuOpen) return;
		menuOpen = false;
		playSfx('close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		closeMenu();
	}

	function handlePointerDown(event: PointerEvent) {
		if (!menuOpen || event.button !== 0) return;
		drag = {
			pointerId: event.pointerId,
			startY: event.clientY,
			lastY: event.clientY,
			lastTime: event.timeStamp,
			velocity: 0,
			height: 0,
			active: false
		};
	}

	function handlePointerMove(event: PointerEvent) {
		if (!drag || event.pointerId !== drag.pointerId) return;

		const offset = event.clientY - drag.startY;

		if (!drag.active) {
			if (Math.abs(offset) < DRAG_THRESHOLD) return;
			drag.active = true;
			drag.height = navigation.offsetHeight;
			navigation.setPointerCapture(event.pointerId);
			gsap.killTweensOf([navigation, backdrop]);
		}

		const elapsed = event.timeStamp - drag.lastTime;
		if (elapsed > 0) drag.velocity = (event.clientY - drag.lastY) / elapsed;
		drag.lastY = event.clientY;
		drag.lastTime = event.timeStamp;

		// Follow the finger downwards; resist dragging upwards like a native sheet.
		const y = offset > 0 ? offset : offset * 0.2;
		const progress = Math.max(0, y) / drag.height;

		setSheetY(y);
		setBackdropOpacity(1 - progress);
	}

	function handlePointerUp(event: PointerEvent) {
		if (!drag || event.pointerId !== drag.pointerId) return;

		const { active, startY, velocity, height } = drag;
		drag = null;

		if (!active) return;

		// A drag ends with a click on whatever is under the finger; swallow it.
		suppressClick = true;
		setTimeout(() => (suppressClick = false));

		const offset = event.clientY - startY;
		const shouldClose = offset > height * CLOSE_DISTANCE || velocity > CLOSE_VELOCITY;

		if (shouldClose && event.type === 'pointerup') {
			closeMenu();
			return;
		}

		const duration = reducedMotion() ? 0 : 0.35;
		gsap.to(navigation, { y: 0, duration, ease: 'power3.out' });
		gsap.to(backdrop, { opacity: 1, duration });
	}

	function handleClickCapture(event: MouseEvent) {
		if (!suppressClick) return;
		event.preventDefault();
		event.stopPropagation();
	}

	$effect(() => {
		const open = menuOpen;

		if (!navigation || !backdrop) return;

		if (!initialized) {
			initialized = true;
			gsap.set(navigation, { yPercent: 100 });
			setSheetY = gsap.quickSetter(navigation, 'y', 'px') as (value: number) => void;
			setBackdropOpacity = gsap.quickSetter(backdrop, 'opacity') as (value: number) => void;
			return;
		}

		const duration = reducedMotion() ? 0 : open ? 0.5 : 0.35;

		gsap.killTweensOf([navigation, backdrop]);

		if (open) gsap.set(navigation, { visibility: 'visible' });

		gsap.to(navigation, {
			yPercent: open ? 0 : 100,
			y: 0,
			duration,
			ease: open ? 'expo.out' : 'power3.in',
			onComplete: () => {
				if (!open) gsap.set(navigation, { visibility: 'hidden' });
			}
		});
		gsap.to(backdrop, { autoAlpha: open ? 1 : 0, duration });

		document.documentElement.style.overflow = open ? 'hidden' : '';
		if (open) {
			window.Lenis?.stop();
			navigation.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
		} else {
			window.Lenis?.start();
			if (navigation.contains(document.activeElement)) menuButton?.focus();
		}
	});

	// The sheet is hidden from the md breakpoint up; don't leave the page scroll-locked.
	$effect(() => {
		if (desktop.current) menuOpen = false;
	});

	$effect(() => () => {
		gsap.killTweensOf([navigation, backdrop]);
		document.documentElement.style.overflow = '';
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#snippet navigationLinks()}
	<ul class="header__links" role="list" aria-label="Main navigation">
		{#each links as link (link.href)}
			<li class="header__link" role="listitem" aria-label={link.label}>
				<a
					href={resolve(link.href as '/')}
					class="link"
					class:link--active={page.url.pathname === link.href}
					aria-current={page.url.pathname === link.href ? 'page' : undefined}
					aria-label={link.label}
					data-uisfx-hover="hover"
					data-uisfx="forward"
					onclick={() => (menuOpen = false)}>{link.label}</a
				>
			</li>
		{/each}
	</ul>
{/snippet}

<header class="header container">
	<a href={resolve('/')} class="header__logo" data-uisfx-hover="hover" data-uisfx="back">
		Portfolio
	</a>

	<button
		bind:this={menuButton}
		class="header__menu-button"
		class:header__menu-button--open={menuOpen}
		aria-expanded={menuOpen}
		aria-controls="main-navigation"
		aria-label={menuOpen ? 'Close menu' : 'Open menu'}
		data-uisfx-hover="hover"
		onclick={toggleMenu}
	>
		<span class="header__menu-icon">
			<span class="header__menu-bar"></span>
			<span class="header__menu-bar"></span>
			<span class="header__menu-bar"></span>
		</span>
	</button>

	<nav class="header__nav">
		{@render navigationLinks()}
	</nav>
</header>

<div bind:this={backdrop} class="header__backdrop" aria-hidden="true" onclick={closeMenu}></div>

<nav
	id="main-navigation"
	bind:this={navigation}
	class="header__menu"
	aria-label="Mobile navigation"
	inert={!menuOpen}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	onclickcapture={handleClickCapture}
>
	<span class="header__menu-handle" aria-hidden="true"></span>
	{@render navigationLinks()}
	<div class="header__menu-footer">
		<!-- eslint-disable svelte/no-navigation-without-resolve -- external URLs -->
		<ul class="header__socials" role="list" aria-label="Social links">
			{#each socialLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						class="link"
						data-uisfx-hover="hover"
						data-uisfx="forward">{link.label}</a
					>
				</li>
			{/each}
		</ul>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->

		<div class="header__sound">
			<SoundToggle />
		</div>
	</div>
</nav>

<style>
	.header {
		position: fixed;
		z-index: 10;
		width: 100%;
		left: 50%;
		transform: translateX(-50%);
		top: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-block: 32px;

		.header__logo {
			color: var(--color-white) !important;
			text-decoration: none !important;
			font-size: 0.875rem;
			mix-blend-mode: difference;
		}

		.header__menu-button {
			display: inline-flex;
			width: 32px;
			height: 32px;
			margin-block: -16px;
			padding: 0;
			align-items: center;
			justify-content: center;
			color: var(--color-white);
			background: none;
			border: 0;
			font: inherit;
			font-size: 0.875rem;
			cursor: pointer;

			background-color: var(--color-secondary) !important;
			border-radius: 4px;
		}

		.header__menu-button:focus-visible {
			outline: 2px solid currentColor;
			outline-offset: 2px;
		}

		.header__menu-icon {
			display: block;
			position: relative;
			width: 16px;
			height: 10px;
		}

		.header__menu-bar {
			position: absolute;
			left: 0;
			width: 100%;
			height: 1px;
			background-color: currentColor;
			border-radius: 2px;
			transition:
				transform 0.25s ease,
				opacity 0.15s ease;
		}

		.header__menu-bar:nth-child(1) {
			top: 0;
		}

		.header__menu-bar:nth-child(2) {
			top: 50%;
			transform: translateY(-50%);
		}

		.header__menu-bar:nth-child(3) {
			bottom: 0;
		}

		.header__menu-button--open .header__menu-bar:nth-child(1) {
			transform: translateY(4.25px) rotate(45deg);
		}

		.header__menu-button--open .header__menu-bar:nth-child(2) {
			opacity: 0;
		}

		.header__menu-button--open .header__menu-bar:nth-child(3) {
			transform: translateY(-4.25px) rotate(-45deg);
		}

		@media (prefers-reduced-motion: reduce) {
			.header__menu-bar {
				transition: none;
			}
		}

		.header__nav {
			display: none;
		}

		@media (--viewport-md-up) {
			.header__menu-button {
				display: none;
			}

			.header__nav {
				display: flex;
			}

			.header__links {
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				gap: 32px;

				.header__link {
					.link {
						font-size: 0.875rem;
					}
				}
			}
		}
	}

	/* Sits below the header so the menu button stays usable as a close control. */
	.header__backdrop {
		position: fixed;
		z-index: 9;
		inset: 0;
		background-color: rgb(0 0 0 / 50%);
		visibility: hidden;
		opacity: 0;

		@media (--viewport-md-up) {
			display: none;
		}
	}

	.header__menu {
		position: fixed;
		z-index: 11;
		inset-inline: 0;
		bottom: 0;
		padding: 12px 16px calc(32px + env(safe-area-inset-bottom));
		background-color: var(--color-secondary);
		border-radius: 16px 16px 0 0;
		box-shadow: 0 -12px 32px rgb(0 0 0 / 20%);
		visibility: hidden;
		touch-action: none;
		user-select: none;

		&::after {
			content: '';
			position: absolute;
			inset-inline: 0;
			top: 100%;
			height: 100px;
			background-color: inherit;
		}

		@media (--viewport-md-up) {
			display: none;
		}

		.header__links {
			gap: 24px;
			padding-bottom: 24px;
			border-bottom: 1px solid color-mix(in srgb, var(--color-quaternary) 40%, transparent);
		}
	}

	.header__socials {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 24px;
		list-style: none;
		margin: 24px 0 0;
		padding: 0;

		.link {
			color: var(--color-quaternary);
			font-size: 0.875rem;
		}
	}

	.header__menu-footer {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 16px;
	}

	.header__sound {
		color: var(--color-quaternary);
		font-size: 0.875rem;
		display: flex;
		align-items: center;
	}

	.header__menu-handle {
		display: block;
		width: 40px;
		height: 4px;
		margin: 0 auto 24px;
		background-color: var(--color-quaternary);
		border-radius: 2px;
	}

	.header__links {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		list-style: none;
		gap: 16px;
		margin: 0;
		padding: 0;

		.header__link {
			.link {
				color: var(--color-white) !important;
				text-decoration: none !important;
				font-size: 1.125rem;
			}
		}
	}
</style>
