<script lang="ts">
	import { datetime } from "$lib/format";
	import {
		PageShell,
		DataTable,
		ChangeCard,
		DiffLine,
		EmptyState,
		searchState,
		filterFields,
	} from "$lib";
	import type { PageServerData } from "./$types";

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();

	const HIDDEN_FIELDS = ["password"];
	const IGNORED_FIELDS = ["modified", "created", "id", "person_id"];

	type DiffField = { field: string; old: string | null; new: string | null };

	function formatValue(k: string, v: unknown): string | null {
		if (v == null) return null;
		if (HIDDEN_FIELDS.includes(k)) return "****";
		const s = String(v);
		// Detect ISO-like date strings and format them
		if (s.length > 15 && !isNaN(Date.parse(s)) && /^\d{4}-\d{2}-\d{2}/.test(s)) {
			return datetime(s);
		}
		return s;
	}

	function diffFields(
		old_value: Record<string, unknown> | null,
		new_value: Record<string, unknown> | null,
	): DiffField[] {
		const normalize = (v: unknown) => (v == null || v === "" ? null : v);

		const allKeys = new Set([
			...Object.keys(old_value ?? {}),
			...Object.keys(new_value ?? {}),
		]);

		return Array.from(allKeys)
			.filter((k) => !IGNORED_FIELDS.includes(k))
			.filter((k) => normalize((old_value ?? {})[k]) !== normalize((new_value ?? {})[k]))
			.map((k) => {
				const vOld = (old_value ?? {})[k];
				const vNew = (new_value ?? {})[k];
				return {
					field: k,
					old: formatValue(k, vOld),
					new: formatValue(k, vNew),
				};
			});
	}

	let filtered = $derived(
		filterFields(data.history, searchState.value, [
			(c) => c.author?.name,
			(c) => c.person?.name,
			(c) => c.role,
		]),
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
								<span class="td-name">{author?.name ?? "—"}</span>
								<span class="person t-small"> → {person?.name ?? "—"}</span>
							</td>
							<td class="td-dim col-role">{role ?? ""}</td>
							<td>
								{#if role}
									{#if !old_values}
										<div class="role-action add">+ assigned <strong>{role}</strong></div>
									{:else if (new_values as any)?.valid_till && !(old_values as any)?.valid_till}
										<div class="role-action remove">- removed <strong>{role}</strong></div>
									{/if}
								{/if}
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
			{#each filtered as { timestamp, new_values, old_values, author, role }, i (i)}
				{@const fields = diffFields(
					old_values as Record<string, unknown> | null,
					new_values as Record<string, unknown> | null,
				)}
				<ChangeCard
					author={author?.name ?? "—"}
					time={datetime(String(timestamp))}
					{fields}
				>
					{#if role}
						{#if !old_values}
							<div class="role-action add">+ assigned {role}</div>
						{:else if (new_values as any)?.valid_till && !(old_values as any)?.valid_till}
							<div class="role-action remove">- removed {role}</div>
						{/if}
					{/if}
				</ChangeCard>
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
	.role-action {
		font-weight: 600;
		font-size: var(--text-sm);
		margin-bottom: 6px;
	}
	.role-action.add {
		color: var(--pri);
	}
	.role-action.remove {
		color: var(--red);
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
