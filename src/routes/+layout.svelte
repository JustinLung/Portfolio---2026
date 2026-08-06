<script lang="ts">
	import '../lib/css/app.css';
	import '../lib/css/normalize.css';
	import '../lib/css/colors.css';
	import '../lib/css/typography.css';
	import '../lib/css/variables.css';
	import '../lib/css/button.css';

	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Lenis from '$lib/components/shared/Lenis.svelte';
	import PageTransition from '$lib/components/shared/PageTransition.svelte';
	import SiteLoader from '$lib/components/shared/SiteLoader.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SiteLoader />
<Lenis />
<PageTransition />
<Header />
<main class="container">
	{@render children()}
</main>
<Footer />
