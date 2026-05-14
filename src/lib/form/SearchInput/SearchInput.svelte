<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
		name?: string;
	}

	let { value = $bindable(''), placeholder = 'Search…', name }: Props = $props();

	function clear() {
		value = '';
	}
</script>

<div class="srch">
	<svg
		class="icon"
		width="14"
		height="14"
		viewBox="0 0 14 14"
		fill="none"
		aria-hidden="true"
	>
		<circle cx="5.8" cy="5.8" r="4" stroke="currentColor" stroke-width="1.5" />
		<path d="M9 9L12.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	</svg>
	<input type="search" {name} {placeholder} bind:value />
	{#if value}
		<button type="button" class="x" onclick={clear} aria-label="Clear search">×</button>
	{/if}
</div>

<style>
	.srch {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--bg-s);
		border: 1px solid var(--bd-m);
		border-radius: 8px;
		padding: 0 12px;
		height: 38px;
		max-width: 380px;
		flex: 1;
		transition: border-color var(--t-fast);
	}
	.srch:focus-within {
		border-color: var(--pri-bd);
	}
	.icon {
		color: var(--txt3);
		flex-shrink: 0;
	}
	input {
		flex: 1;
		background: none;
		border: none;
		color: var(--txt);
		font-family: var(--font-body);
		font-size: var(--text-base);
		outline: none;
	}
	input::placeholder {
		color: var(--txt3);
	}
	input::-webkit-search-cancel-button {
		appearance: none;
	}
	.x {
		background: none;
		border: none;
		color: var(--txt3);
		cursor: pointer;
		font-size: 18px;
		line-height: 1;
		padding: 0;
		transition: color var(--t-fast);
	}
	.x:hover {
		color: var(--txt);
	}
</style>
