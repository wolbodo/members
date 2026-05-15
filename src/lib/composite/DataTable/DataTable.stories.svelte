<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, within } from 'storybook/test';
	import DataTable from './DataTable.svelte';
	import Chip from '../../primitives/Chip/Chip.svelte';
	import z from 'zod';
	import { generate } from 'zod4-mock';

	const { Story } = defineMeta({
		title: 'Composite/DataTable',
		component: DataTable
	});

	const onRowClick = fn();

	const rows = generate(
		z
			.object({
				name: z.string(),
				email: z.email(),
				city: z.string(),
				fullName: z.string(),
				roles: z.set(z.enum(['member', 'board', 'nerd']))
			})
			.array()
			.min(3)
	);
</script>

<Story
	name="Member table"
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const bodyRows = canvas.getAllByRole('row').filter((r) => r.classList.contains('clickable'));
		await userEvent.click(bodyRows[0]);
		await expect(onRowClick).toHaveBeenCalledOnce();
	}}
>
	{#snippet template()}
		<DataTable>
			{#snippet head()}
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>City</th>
					<th>Full name</th>
					<th>Roles</th>
				</tr>
			{/snippet}
			{#snippet body()}
				{#each rows as r (r.name)}
					<tr class="clickable" onclick={() => onRowClick(r.name)}>
						<td class="td-name">{r.name}</td>
						<td class="td-dim">{r.email}</td>
						<td class="td-dim">{r.city}</td>
						<td class="td-dim">{r.fullName}</td>
						<td>
							<div style="display:flex; gap:4px; flex-wrap:nowrap; align-items:center;">
								{#each r.roles as role (role)}
									<Chip {role} />
								{/each}
							</div>
						</td>
					</tr>
				{/each}
			{/snippet}
		</DataTable>
	{/snippet}
</Story>
