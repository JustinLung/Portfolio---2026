<script lang="ts">
	import type { ExperienceItem } from '../../../utils/types';
	import Experience from './Experience.svelte';

	let { items }: { items: ExperienceItem[] } = $props();
</script>

<!--
	@component
	Renders a list of work and education experiences.
-->
<section class="experiences">
	<ul class="experiences__list">
		{#each items as item (item.id)}
			<Experience {item} />
		{/each}
	</ul>
</section>

<style>
	.experiences {
		padding-block: 128px;

		.experiences__list {
			display: flex;
			flex-direction: column;
			list-style: none;
            padding: 0;
		}
	}
</style>
