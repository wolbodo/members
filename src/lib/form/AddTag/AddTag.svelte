<script lang="ts">
	interface Props {
		onadd: (role: string) => void;
		placeholder?: string;
	}

	let { onadd, placeholder = 'role name' }: Props = $props();

	let editing = $state(false);
	let value = $state('');
	let inputEl = $state<HTMLInputElement>();

	function start() {
		editing = true;
		queueMicrotask(() => inputEl?.focus());
	}

	function cancel() {
		editing = false;
		value = '';
	}

	function confirm() {
		const v = value.trim();
		if (v) onadd(v);
		cancel();
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			confirm();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			cancel();
		}
	}
</script>

{#if editing}
	<span class="row">
		<input
			class="in"
			type="text"
			{placeholder}
			bind:value
			bind:this={inputEl}
			onkeydown={onKey}
			onblur={() => setTimeout(cancel, 150)}
		/>
		<button class="ok" type="button" onmousedown={confirm}>add</button>
	</span>
{:else}
	<button class="add" type="button" onclick={start}>+ add role</button>
{/if}

<style>
	.add {
		background: none;
		border: 1px dashed var(--bd-m);
		color: var(--txt2);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 600;
		padding: 5px 12px;
		border-radius: var(--r-pill);
		cursor: pointer;
		transition: all var(--t-fast);
	}
	.add:hover {
		border-color: var(--pri);
		color: var(--pri);
		background: var(--pri-bg);
	}
	.row {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.in {
		background: var(--bg-s);
		border: 1px solid var(--pri-bd);
		border-radius: var(--r-pill);
		padding: 4px 12px;
		color: var(--txt);
		font-family: var(--font-body);
		font-size: var(--text-md);
		outline: none;
		width: 140px;
		transition: border-color var(--t-fast);
	}
	.in::placeholder {
		color: var(--txt3);
	}
	.in:focus {
		border-color: var(--pri);
	}
	.ok {
		background: var(--pri-bg);
		border: 1px solid var(--pri-bd);
		color: var(--pri);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 700;
		padding: 4px 10px;
		border-radius: var(--r-pill);
		cursor: pointer;
		transition: all var(--t-fast);
	}
	.ok:hover {
		background: var(--pri);
		color: #111;
	}
</style>
