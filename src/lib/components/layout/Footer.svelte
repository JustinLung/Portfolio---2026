<script lang="ts">
	import { resolve } from '$app/paths';
	import { links, policyLinks, socialLinks } from '../../../utils/links';

	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="footer__inner container">
		<div class="footer__cta">
			<span class="footer__eyebrow font-small">Available for select projects</span>
			<p class="font-heading-4 font__heading font-heading">
				Have a project in mind?<br />I promise only 3% of my time is spent Googling.
			</p>
		</div>

		<nav class="footer__navigation" aria-label="Footer navigation">
			<div class="footer__column">
				<p class="footer__label font-small">Explore</p>
				<ul class="footer__links" role="list">
					{#each links as link (link.href)}
						<li>
							<a href={resolve(link.href as '/')} class="link">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<div class="footer__column">
				<p class="footer__label font-small">Socials</p>
				<ul class="footer__links" role="list">
					{#each socialLinks as link (link.href)}
						<li>
							<a href={link.href} target="_blank" rel="noopener noreferrer" class="link"
								>{link.label}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		</nav>

		<div class="footer__meta font-small">
			<p>© {year} Portfolio</p>
			<div class="footer__policy-links">
				{#each policyLinks as link (link.href)}
					<a href={link.href} class="link">{link.label}</a>
				{/each}
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		color: var(--color-white);
		background-color: var(--color-tertiary);

		.footer__inner {
			display: grid;
			gap: 64px;
			padding-block: 32px 24px;
		}

		.footer__cta {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			margin-bottom: 64px;
		}

		.footer__eyebrow {
			margin-bottom: 12px;
		}

		.footer__navigation {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 24px;
			align-self: end;
		}

		.footer__label {
			color: var(--color-quaternary);
		}

		.footer__links {
			display: grid;
			gap: 8px;
			margin: 12px 0 0;
			padding: 0;
			list-style: none;

			a {
				display: inline-block;
				color: inherit;
				font-size: 0.875rem;
				text-decoration: none;
			}
		}

		.link {
			cursor: pointer;
		}

		.footer__meta {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			gap: 24px;
			padding-top: 16px;
			border-top: 1px solid var(--color-primary);

			p {
				margin: 0;
			}

			a {
				color: inherit;
				font-size: 0.875rem;
				text-decoration: none;
				white-space: nowrap;
			}
		}

		.footer__policy-links {
			display: flex;
			gap: 16px;

			a {
				text-decoration: underline;
				text-underline-offset: 4px;
			}
		}

		@media (--viewport-md-up) {
			.footer__inner {
				position: relative;
				grid-template-columns: repeat(4, minmax(0, 1fr));
				grid-template-rows: auto 1fr auto;
				gap: 0 32px;
				padding-block: 48px 32px;
			}

			.footer__cta {
				grid-column: 1 / 3;
				grid-row: 1;
				margin-bottom: 128px;
			}

			.footer__heading {
				max-width: 620px;
			}

			.footer__navigation {
				grid-column: 1 / 3;
				grid-row: 2;
				align-self: end;
				margin-bottom: 40px;
			}

			.footer__meta {
				grid-row: 3;
				grid-column: 1 / -1;
			}
		}

		@media (--viewport-lg-up) {
			.footer__navigation {
				gap: 48px;
			}
		}
	}
</style>
