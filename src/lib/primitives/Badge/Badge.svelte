<script lang="ts">
	type Status = 'sent' | 'pending' | 'error';

	interface Props {
		status: Status;
	}

	let { status }: Props = $props();
</script>

<span class="badge status-{status}">{status}</span>

<style>
	.badge {
		display: inline-block;
		padding: 3px 9px;
		border-radius: var(--r-sm);
		font-size: var(--text-xs);
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		border: 1px solid;
		font-family: var(--font-body);
	}
	.status-sent {
		color: var(--green);
		background: rgba(0, 196, 106, 0.1);
		border-color: rgba(0, 196, 106, 0.3);
	}
	.status-pending {
		color: var(--amber);
		background: rgba(232, 161, 80, 0.1);
		border-color: rgba(232, 161, 80, 0.3);
	}
	.status-error {
		color: var(--red);
		background: rgba(224, 85, 85, 0.1);
		border-color: rgba(224, 85, 85, 0.3);
	}
</style>
