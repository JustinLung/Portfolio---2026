<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { gsap } from 'gsap';
	import { links } from '../../../utils/links';
	import { onDestroy } from 'svelte';

	let menuOpen = $state(false);
	let navigation: HTMLElement;

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

<svelte:window onkeydown={(event) => event.key === 'Escape' && (menuOpen = false)} />

<header class="header container">
	<a href={resolve('/')} class="header__logo"> Portfolio </a>

	<button
		class="header__menu-button"
		aria-expanded={menuOpen}
		aria-controls="main-navigation"
		onclick={() => (menuOpen = !menuOpen)}
	>
		{menuOpen ? 'Close' : 'Menu'}
	</button>

	<nav id="main-navigation" bind:this={navigation} class="header__nav">
		<ul class="header__links" role="list" aria-label="Main navigation">
			{#each links as link (link.href)}
				<li class="header__link" role="listitem" aria-label={link.label}>
					<a
						href={resolve(link.href as '/')}
						class="link"
						class:link--active={page.url.pathname === link.href}
						aria-current={page.url.pathname === link.href ? 'page' : undefined}
						aria-label={link.label}
						onclick={() => (menuOpen = false)}
						>{link.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	.header {
		position: fixed;
		z-index: 10;
		width: 100%;
		left: 50%;
		transform: translateX(-50%);
		mix-blend-mode: difference;
		top: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-block: 32px;

		.header__logo {
			color: var(--color-white) !important;
			text-decoration: none !important;
			font-size: 0.875rem;
		}

		.header__menu-button {
			padding: 0;
			color: var(--color-white);
			background: none;
			border: 0;
			font: inherit;
			font-size: 0.875rem;
			cursor: pointer;
		}

		.header__nav {
			position: absolute;
			top: calc(100% - 8px);
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
					font-size: 0.875rem;
				}
			}
		}

		@media (--viewport-md-up) {
			.header__menu-button {
				display: none;
			}

			.header__nav {
				position: static;
				display: flex;
				width: auto;
				padding: 0;
				background: none;
				border-radius: 0;
				box-shadow: none;
				visibility: visible !important;
				opacity: 1 !important;
				transform: none !important;
				pointer-events: auto !important;
			}

			.header__links {
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				gap: 32px;
			}
		}
	}
</style>
