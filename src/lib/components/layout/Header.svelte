<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import gsap from 'gsap';
	import { links } from '../../../utils/links';
	import { onDestroy } from 'svelte';
	import { playSfx } from '$lib/sfx';

	let menuOpen = $state(false);
	let navigation: HTMLElement;
	let headerHeight = $state(0);

	function toggleMenu() {
		menuOpen = !menuOpen;
		playSfx(menuOpen ? 'open' : 'close');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' || !menuOpen) return;
		menuOpen = false;
		playSfx('close');
	}

	$effect(() => {
		const open = menuOpen;

		if (!navigation) return;

		gsap.killTweensOf(navigation);
		gsap.to(navigation, {
			autoAlpha: open ? 1 : 0,
			y: open ? 0 : -8,
			pointerEvents: open ? 'auto' : 'none',
			duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.25,
			ease: 'power2.out'
		});
	});

	onDestroy(() => {
		gsap.killTweensOf(navigation);
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

<header class="header container" bind:clientHeight={headerHeight}>
	<a href={resolve('/')} class="header__logo" data-uisfx-hover="hover" data-uisfx="back">
		Portfolio
	</a>

	<button
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

<nav
	id="main-navigation"
	bind:this={navigation}
	class="header__menu"
	style="--header-height: {headerHeight}px"
>
	{@render navigationLinks()}
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

	.header__menu {
		position: fixed;
		z-index: 10;
		top: calc(var(--header-height) - 8px);
		right: 16px;
		width: min(240px, calc(100% - 32px));
		padding: 16px;
		background-color: var(--color-secondary);
		border-radius: 4px;
		box-shadow: 0 12px 32px rgb(0 0 0 / 20%);
		visibility: hidden;
		opacity: 0;
		transform: translateY(-8px);
		pointer-events: none;

		@media (--viewport-md-up) {
			display: none;
		}
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
