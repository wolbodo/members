<script lang="ts">
	import { datetime } from '$lib/format';
	import {
		PageShell,
		DataTable,
		MailCard,
		Badge,
		EmptyState,
		SearchInput,
		searchState,
		filterFields
	} from '$lib';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	let filtered = $derived(
		filterFields(data.mails, searchState.value, [
			(m) => m.personName,
			(m) => m.personEmail,
			(m) => m.status,
			(m) => m.template
		])
	);

	const badgeStatus = (status: string | null): 'sent' | 'pending' | 'error' =>
		status === 'sent' ? 'sent' : status === 'error' ? 'error' : 'pending';
</script>

<svelte:head>
	<title>Mail</title>
</svelte:head>

<PageShell>
	<div class="title-row">
		<h1 class="t-heading">Mail</h1>
		<span class="count t-small">{filtered.length} entries</span>
		<div class="search">
			<SearchInput bind:value={searchState.value} placeholder="Search to, email, template…" />
		</div>
	</div>

	{#if filtered.length === 0}
		<EmptyState>No mails yet.</EmptyState>
	{:else}
		<div class="desktop">
			<DataTable>
				{#snippet head()}
					<tr>
						<th class="col-status">Status</th>
						<th>To</th>
						<th class="col-tmpl">Template</th>
						<th class="col-time">Time</th>
					</tr>
				{/snippet}
				{#snippet body()}
					{#each filtered as { status, personName, personEmail, template, created }, i (i)}
						<tr>
							<td class="col-status">
								<Badge status={badgeStatus(status)} />
							</td>
							<td>
								<span class="td-name">{personName ?? '—'}</span>
								<a class="email" href="mailto:{personEmail}">{personEmail}</a>
							</td>
							<td class="td-dim col-tmpl">{template}</td>
							<td class="td-dim col-time">{datetime(String(created))}</td>
						</tr>
					{/each}
				{/snippet}
			</DataTable>
		</div>

		<div class="mobile">
			{#each filtered as { status, personName, personEmail, template, created }, i (i)}
				<MailCard
					to={personName ?? '—'}
					email={personEmail ?? ''}
					{template}
					time={datetime(String(created))}
					status={badgeStatus(status)}
				/>
			{/each}
		</div>
	{/if}
</PageShell>

<style>
	.title-row {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 22px;
	}
	.count {
		color: var(--txt3);
	}
	.search {
		margin-left: auto;
		flex: 0 1 180px;
		min-width: 0;
		overflow: hidden;
	}
	.col-status {
		width: 90px;
	}
	.col-time {
		width: 155px;
	}
	.email {
		display: block;
		font-size: var(--text-xs);
		color: var(--txt2);
		margin-top: 2px;
	}
	.email:hover {
		color: var(--pri);
	}
	.desktop {
		display: block;
	}
	.mobile {
		display: none;
		flex-direction: column;
		gap: 8px;
	}
	@media (max-width: 650px) {
		.col-time {
			display: none;
		}
	}
	@media (max-width: 520px) {
		.desktop {
			display: none;
		}
		.mobile {
			display: flex;
		}
	}
</style>
