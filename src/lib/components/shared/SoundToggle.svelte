<script lang="ts">
	import { isSfxEnabled, playSfx, setSfxEnabled } from '$lib/sfx';
	import { onMount, tick } from 'svelte';

	let enabled = $state(true);

	onMount(async () => {
		await tick();
		enabled = isSfxEnabled();
	});

	function toggleSound() {
		const nextEnabled = !enabled;

		if (nextEnabled) {
			setSfxEnabled(true);
			enabled = true;
			playSfx('toggle-on');
			return;
		}

		playSfx('toggle-off');
		enabled = false;
		setSfxEnabled(false);
	}
</script>

<button
	type="button"
	class="sound-toggle"
	aria-label={enabled ? 'Turn interface sounds off' : 'Turn interface sounds on'}
	aria-pressed={enabled}
	data-uisfx-hover="hover"
	onclick={toggleSound}
>
	<span class="sound-toggle__indicator" aria-hidden="true"></span>
	Sound {enabled ? 'on' : 'off'}
</button>

<style>
	.sound-toggle {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		padding: 0;
		border: 0;
		color: inherit;
		background: transparent;
		font: inherit;
		cursor: pointer;
	}

	.sound-toggle__indicator {
		width: 8px;
		height: 8px;
		border: 1px solid currentColor;
		border-radius: 50%;
		background: currentColor;
		opacity: 1;
		transition: opacity 200ms ease;
	}

	.sound-toggle[aria-pressed='false'] .sound-toggle__indicator {
		opacity: 0.3;
	}

	.sound-toggle:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 4px;
	}
</style>
