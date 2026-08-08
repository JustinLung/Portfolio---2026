<script lang="ts">
	import Hero from '$lib/components/shared/Hero.svelte';
	import KineticManifesto from '$lib/components/shared/KineticManifesto.svelte';
	import LatestWork from '$lib/components/shared/LatestWork.svelte';
	import PersonalIntro from '$lib/components/shared/PersonalIntro.svelte';
	import Seo from '$lib/components/shared/Seo.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const description =
		"I'm Justin, a 23-year-old creative coder based in Amsterdam, focused on building accessible, motion-led digital experiences with GSAP, Framer Motion, Next.js and SvelteKit. I also develop custom themes for Shopify, HubSpot and WordPress, combining thoughtful design with reliable, flexible code. Away from the screen, you'll usually find me training for powerlifting and chasing a new personal best.";
</script>

<Seo title="Creative Coder" {description} />

<Hero />
<KineticManifesto />
<LatestWork items={data.works} />
<PersonalIntro title="About me" {description} image="/images/justin.avif" />
