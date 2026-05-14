<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn, userEvent, within } from 'storybook/test';
	import DataTable from './DataTable.svelte';
	import Chip from '../../primitives/Chip/Chip.svelte';

	const { Story } = defineMeta({
		title: 'Composite/DataTable',
		component: DataTable
	});

	const onRowClick = fn();

	const rows = [
		{ name: 'Klaas', email: 'klaas@debeer.nl', city: 'Delft', full: 'Klaas de Beer', roles: ['member', 'board', 'nerd'] },
		{ name: 'Sofie', email: 's.vandam@gmail.com', city: 'Delft', full: 'Sofie van Dam', roles: ['member'] },
		{ name: 'Joep', email: 'joeppeters@hotmail.com', city: 'Delft', full: 'Joep Peters', roles: ['board', 'member'] },
		{ name: 'Gijs', email: 'g.devos@proton.me', city: 'Delft', full: 'Gijs de Vos', roles: ['member', 'nerd'] }
	];
</script>

<Story name="Member table">
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
					<tr class="clickable">
						<td class="td-name">{r.name}</td>
						<td class="td-dim">{r.email}</td>
						<td class="td-dim">{r.city}</td>
						<td class="td-dim">{r.full}</td>
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

<Story
	name="Row click fires"
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
				</tr>
			{/snippet}
			{#snippet body()}
				{#each rows as r (r.name)}
					<tr class="clickable" onclick={() => onRowClick(r.name)}>
						<td class="td-name">{r.name}</td>
						<td class="td-dim">{r.email}</td>
					</tr>
				{/each}
			{/snippet}
		</DataTable>
	{/snippet}
</Story>
