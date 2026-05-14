<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
		name?: string;
		rows?: number;
		readonly?: boolean;
		[key: string]: unknown;
	}

	let {
		value = $bindable(''),
		placeholder,
		name,
		rows = 4,
		readonly = false,
		...rest
	}: Props = $props();
</script>

<textarea class="ta" {name} {rows} {placeholder} {readonly} bind:value {...rest}></textarea>

<style>
	.ta {
		width: 100%;
		resize: vertical;
		min-height: 72px;
		border: 1.5px solid var(--bd);
		border-radius: var(--r-md);
		padding: 8px 10px;
		background: var(--bg-s);
		color: var(--txt);
		font-family: var(--font-body);
		font-size: var(--text-base);
		font-weight: 400;
		line-height: 1.4;
		outline: none;
		transition:
			border-color var(--t-fast),
			background var(--t-fast);
	}
	.ta:hover {
		border-color: var(--bd-m);
	}
	.ta:focus {
		border-color: var(--pri);
		background: var(--pri-bg);
	}
	.ta::placeholder {
		color: var(--txt3);
	}
</style>
