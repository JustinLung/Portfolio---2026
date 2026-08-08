<script lang="ts">
	import Hero from '$lib/components/shared/Hero.svelte';
	import KineticManifesto from '$lib/components/shared/KineticManifesto.svelte';
	import LatestWork from '$lib/components/shared/LatestWork.svelte';
	import PersonalIntro from '$lib/components/shared/PersonalIntro.svelte';
	import Seo from '$lib/components/shared/Seo.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Seo title={data.page.hero.subtitle} description={data.page.personal.text} />

<Hero title={data.page.hero.title} subtitle={data.page.hero.subtitle} />
<KineticManifesto />
<LatestWork
	items={data.works}
	title={data.page.latestWork.title}
	subtitle={data.page.latestWork.subtitle}
/>
<PersonalIntro
	title={data.page.personal.title}
	subtitle={data.page.personal.subtitle}
	description={data.page.personal.text}
	image={data.page.personal.image}
	imageAlt={data.page.personal.imageAlt}
/>
