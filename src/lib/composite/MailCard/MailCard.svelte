<script lang="ts">
	import Badge from '../../primitives/Badge/Badge.svelte';

	interface Props {
		to: string;
		email: string;
		template: string;
		time: string;
		status: 'sent' | 'pending';
	}

	let { to, email, template, time, status }: Props = $props();
</script>

<div class="card">
	<div class="hd">
		<div class="left">
			<span class="to">{to}</span>
			<span class="email">{email}</span>
		</div>
		<span class="time">{time}</span>
	</div>
	<div class="foot">
		<Badge {status} />
		<span class="tmpl">{template}</span>
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 0;
		background: var(--bg-s);
		border: 1px solid var(--bd);
		border-radius: var(--r-lg);
		padding: 13px 14px;
		cursor: default;
	}
	.hd {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 8px;
	}
	.left {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}
	.to {
		font-size: var(--text-md);
		font-weight: 600;
		color: var(--pri);
	}
	.email {
		font-size: var(--text-xs);
		color: var(--txt2);
	}
	.time {
		font-size: var(--text-xs);
		color: var(--txt3);
	}
	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		border-top: 1px solid var(--bd);
		padding-top: 8px;
	}
	.tmpl {
		font-size: var(--text-xs);
		color: var(--txt3);
	}
</style>
