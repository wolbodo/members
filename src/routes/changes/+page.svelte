<script lang="ts">
	import { datetime } from '$lib/format';
	import {
		PageShell,
		DataTable,
		ChangeCard,
		DiffLine,
		EmptyState,
		searchState,
		filterFields
	} from '$lib';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	const HIDDEN_FIELDS = ['password'];

	type DiffField = { field: string; old: string | null; new: string | null };

	function diffFields(
		old_value: Record<string, unknown> | null,
		new_value: Record<string, unknown> | null
	): DiffField[] {
		if (!old_value) {
			return Object.entries(new_value ?? {})
				.filter(([, v]) => v != null && v !== '')
				.map(([k, v]) => ({
					field: k,
					old: null,
					new: HIDDEN_FIELDS.includes(k) ? '****' : String(v)
				}));
		}
		return Object.entries(old_value)
			.filter(([k, v]) => v !== (new_value ?? {})[k])
			.map(([k, v]) => ({
				field: k,
				old: HIDDEN_FIELDS.includes(k) ? '****' : v == null ? null : String(v),
				new:
					HIDDEN_FIELDS.includes(k)
						? '****'
						: (new_value ?? {})[k] == null
							? null
							: String((new_value ?? {})[k])
			}));
	}

	let filtered = $derived(
		filterFields(data.history, searchState.value, [
			(c) => c.author?.name,
			(c) => c.person?.name,
			(c) => c.role
		])
	);
</script>

<svelte:head>
	<title>Changes</title>
</svelte:head>

<PageShell>
	<div class="title-row">
		<h1 class="t-heading">Changes</h1>
		<span class="count t-small">{filtered.length} entries</span>
	</div>

	{#if filtered.length === 0}
		<EmptyState>No changes recorded.</EmptyState>
	{:else}
		<div class="desktop">
			<DataTable>
				{#snippet head()}
					<tr>
						<th class="col-time">Time</th>
						<th class="col-who">Author → person</th>
						<th class="col-role">Role</th>
						<th>Changes</th>
					</tr>
				{/snippet}
				{#snippet body()}
					{#each filtered as { timestamp, new_values, old_values, role, author, person }, i (i)}
						<tr>
							<td class="td-dim col-time">{datetime(String(timestamp))}</td>
							<td class="col-who">
								<span class="td-name">{author?.name ?? '—'}</span>
								<span class="person t-small"> → {person?.name ?? '—'}</span>
							</td>
							<td class="td-dim col-role">{role ?? ''}</td>
							<td>
								{#each diffFields(old_values as Record<string, unknown> | null, new_values as Record<string, unknown> | null) as f (f.field)}
									<DiffLine field={f.field} oldValue={f.old} newValue={f.new} />
								{/each}
							</td>
						</tr>
					{/each}
				{/snippet}
			</DataTable>
		</div>

		<div class="mobile">
			{#each filtered as { timestamp, new_values, old_values, author }, i (i)}
				<ChangeCard
					author={author?.name ?? '—'}
					time={datetime(String(timestamp))}
					fields={diffFields(
						old_values as Record<string, unknown> | null,
						new_values as Record<string, unknown> | null
					)}
				/>
			{/each}
		</div>
	{/if}
</PageShell>

<style>
	.title-row {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 22px;
	}
	.count {
		color: var(--txt3);
	}
	.col-time {
		width: 130px;
	}
	.col-who {
		width: 200px;
	}
	.col-role {
		width: 80px;
	}
	.person {
		display: block;
		margin-top: 1px;
	}
	.desktop {
		display: block;
	}
	.mobile {
		display: none;
		flex-direction: column;
		gap: 8px;
	}
	@media (max-width: 700px) {
		.col-role {
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
