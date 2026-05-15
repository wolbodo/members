<script lang="ts">
	import type { Snippet } from 'svelte';

	interface NavItem {
		label: string;
		href: string;
		active?: boolean;
	}

	interface Props {
		nav: NavItem[];
		search?: Snippet;
		trailing?: Snippet;
		brandHref?: string;
		brandLabel?: string;
	}

	let { nav, search, trailing, brandHref = '/', brandLabel = 'members' }: Props = $props();
</script>

<header class="app-header">
	<a class="brand" href={brandHref}>
		<svg class="wmark" width="18" height="14" viewBox="0 0 22 17" fill="none" aria-hidden="true">
			<path
				d="M1.5 2.5L5.5 14.5L11 5.5L16.5 14.5L20.5 2.5"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<span class="wordmark">wolbodo <em>{brandLabel}</em></span>
	</a>

	<nav class="nav">
		{#each nav as item (item.href)}
			<a class="link" class:active={item.active} href={item.href}>{item.label}</a>
		{/each}
	</nav>

	{#if search}<div class="search">{@render search()}</div>{/if}
	{#if trailing}<div class="trailing">{@render trailing()}</div>{/if}
</header>

<style>
	.app-header {
		position: sticky;
		top: 0;
		z-index: 200;
		height: 54px;
		display: flex;
		align-items: center;
		padding: 0 24px;
		gap: 0;
		background: rgba(16, 15, 13, 0.97);
		backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--bd);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 9px;
		cursor: pointer;
		margin-right: 32px;
		flex-shrink: 0;
	}
	.wmark {
		color: var(--pri);
	}
	.wordmark {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--txt);
		letter-spacing: -0.02em;
	}
	.wordmark em {
		color: var(--pri);
		font-style: normal;
	}
	.nav {
		display: flex;
		align-items: center;
		gap: 2px;
		flex: 1;
	}
	.link {
		font-size: var(--text-md);
		font-weight: 500;
		color: var(--txt2);
		padding: 5px 12px;
		border: none;
		background: none;
		cursor: pointer;
		border-radius: 6px;
		transition:
			color var(--t-fast),
			background var(--t-fast);
		position: relative;
		letter-spacing: 0.01em;
	}
	.link:hover {
		color: var(--txt);
		background: rgba(255, 255, 255, 0.05);
	}
	.link.active {
		color: var(--txt);
		font-weight: 600;
	}
	.link.active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 12px;
		right: 12px;
		height: 2px;
		background: var(--pri);
		border-radius: 2px 2px 0 0;
	}
	.search {
		margin-left: auto;
		margin-right: 12px;
		display: flex;
		min-width: 200px;
		max-width: 280px;
	}
	.search :global(.srch) {
		height: 32px;
		border-radius: 7px;
	}
	.trailing {
		margin-left: auto;
	}
	.search + .trailing {
		margin-left: 0;
	}

	@media (max-width: 600px) {
		.app-header {
			padding: 0 14px;
		}
		.brand {
			margin-right: 8px;
		}
		.wordmark em {
			display: none;
		}
		.link {
			padding: 5px 9px;
			font-size: var(--text-sm);
		}
	}
</style>
