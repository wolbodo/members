<script lang="ts">
	import { datetime } from '$lib/format';
	import {
		PageShell,
		DataTable,
		ChangeCard,
		DiffLine,
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

	const HIDDEN_FIELDS = ['password'];
	const IGNORED_FIELDS = ['modified', 'created', 'id', 'person_id', 'valid_till', 'valid_from'];

	type DiffField = { field: string; old: string | null; new: string | null };

	function formatValue(k: string, v: unknown): string | null {
		if (v == null || v === 'null' || v === '') return null;
		if (HIDDEN_FIELDS.includes(k)) return '****';
		const s = String(v);
		// Detect ISO-like date strings and format them
		if (s.length > 15 && !isNaN(Date.parse(s)) && /^\d{4}-\d{2}-\d{2}/.test(s)) {
			return datetime(s);
		}
		return s;
	}

	function diffFields(old_value: unknown, new_value: unknown, role?: string | null): DiffField[] {
		const old = (old_value as Record<string, unknown>) ?? {};
		const curr = (new_value as Record<string, unknown>) ?? {};

		const allKeys = new Set([...Object.keys(old), ...Object.keys(curr)]);

		const normalize = (v: unknown) => (v == null || v === 'null' ? null : v);

		// Compare on the rendered value so e.g. actual null and the string "null"
		// (both formatted to null) don't show up as a spurious null → null diff.
		// For hidden fields compare raw values — both hashes mask to '****' so
		// formatted comparison would always consider them equal.
		const fields = Array.from(allKeys)
			.filter((k) => !IGNORED_FIELDS.includes(k))
			.map((k) => ({
				field: k,
				old: formatValue(k, old[k]),
				new: formatValue(k, curr[k])
			}))
			.filter((f) =>
				HIDDEN_FIELDS.includes(f.field)
					? normalize(old[f.field]) !== normalize(curr[f.field])
					: f.old !== f.new
			);

		// Inject role change if this is a role history entry
		if (role) {
			if (!old_value) {
				fields.unshift({ field: 'role', old: null, new: role });
			} else if (curr.valid_till && !old.valid_till) {
				fields.unshift({ field: 'role', old: role, new: null });
			}
		}

		return fields;
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
		<div class="search">
			<SearchInput bind:value={searchState.value} placeholder="Search author, person, role…" />
		</div>
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
								{#each diffFields(old_values, new_values, role) as f (f.field)}
									<DiffLine field={f.field} oldValue={f.old} newValue={f.new} />
								{/each}
							</td>
						</tr>
					{/each}
				{/snippet}
			</DataTable>
		</div>

		<div class="mobile">
			{#each filtered as { timestamp, new_values, old_values, author, role }, i (i)}
				<ChangeCard
					author={author?.name ?? '—'}
					time={datetime(String(timestamp))}
					fields={diffFields(old_values, new_values, role)}
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
	.col-time {
		width: 130px;
	}
	.col-who {
		width: 200px;
	}
	.col-role {
		width: 80px;
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
