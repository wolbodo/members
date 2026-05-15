<script lang="ts">
	interface Props {
		value: string;
		type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'number';
		placeholder?: string;
		name?: string;
		readonly?: boolean;
		disabled?: boolean;
		[key: string]: unknown;
	}

	let {
		value = $bindable(''),
		type = 'text',
		placeholder,
		name,
		readonly = false,
		disabled = false,
		...rest
	}: Props = $props();
</script>

<input class="glass" {type} {name} {placeholder} {readonly} {disabled} bind:value {...rest} />

<style>
	.glass {
		width: 100%;
		background: rgba(255, 255, 255, 0.04);
		border: none;
		border-bottom: 1.5px solid transparent;
		color: var(--txt);
		font-family: var(--font-body);
		font-size: var(--text-base);
		font-weight: 400;
		padding: 5px 6px;
		line-height: 1.4;
		transition:
			border-color var(--t-fast),
			background var(--t-fast);
		outline: none;
		border-radius: 4px 4px 0 0;
	}
	.glass:hover {
		background: rgba(255, 255, 255, 0.07);
		border-bottom-color: var(--bd-m);
	}
	.glass:focus {
		background: var(--pri-bg);
		border-bottom-color: var(--pri);
	}
	.glass::placeholder {
		color: var(--txt3);
	}
	.glass:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
