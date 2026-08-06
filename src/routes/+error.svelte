<script>
	import { resolve } from '$app/paths';
</script>

<section>
	<div class="error-container">
		<h1>404</h1>
		<p>Page not found</p>
	</div>
	<a href={resolve('/')} class="button button--secondary">Go back to the home page</a>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		font-size: 4rem;
		font-weight: 700;
        margin: 0;
        padding: 0;
	}

	p {
		font-size: 1.5rem;
	}
</style>
