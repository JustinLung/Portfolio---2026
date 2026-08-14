<script lang="ts">
	import '../lib/css/app.css';
	import '../lib/css/normalize.css';
	import '../lib/css/colors.css';
	import '../lib/css/typography.css';
	import '../lib/css/variables.css';
	import '../lib/css/button.css';
	import '../utils/easter-egg';
	import favicon from '$lib/assets/favicon.ico';
	import CustomCursor from '$lib/components/shared/ui/CustomCursor.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Lenis from '$lib/components/shared/ui/Lenis.svelte';
	import PageTransition from '$lib/components/shared/ui/PageTransition.svelte';
	import SiteLoader from '$lib/components/shared/ui/SiteLoader.svelte';
	import { initializeSfx, unlockSfx } from '$lib/sfx';
	import { onMount } from 'svelte';
	import SkipMainContent from '$lib/components/shared/ui/SkipMainContent.svelte';

	let { children } = $props();

	onMount(() => {
		const destroySfx = initializeSfx(document);

		const unlock = () => {
			window.removeEventListener('pointerdown', unlock, true);
			window.removeEventListener('keydown', unlock, true);
			void unlockSfx();
		};

		window.addEventListener('pointerdown', unlock, { capture: true });
		window.addEventListener('keydown', unlock, { capture: true });

		return () => {
			window.removeEventListener('pointerdown', unlock, true);
			window.removeEventListener('keydown', unlock, true);
			void destroySfx();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SiteLoader />
<Lenis />
<PageTransition />
<CustomCursor />
<Header />
<SkipMainContent />
<main id="main" class="container" tabindex="-1">
	{@render children()}
</main>
<Footer />
