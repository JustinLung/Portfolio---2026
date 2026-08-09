<a href="#main" class="button skip-link">Skip to content</a>

<style>
	.skip-link {
		position: fixed;
		z-index: 10001;
		top: -64px;
		left: 16px;
		transition: top 250ms var(--easeOutExpo);

		&:focus {
			top: 16px;
		}

		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
	}
</style>
