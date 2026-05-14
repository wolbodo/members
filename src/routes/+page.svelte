<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import {
    PageShell,
    Tabs,
    Tab,
    SearchInput,
    Pill,
    DataTable,
    MemberCard,
    Chip,
    EmptyState,
    Button,
    ROLE_NAMES,
  } from "$lib";
  import type { PageServerData } from "./$types";

  interface Props {
    data: PageServerData;
  }

  let { data }: Props = $props();

  let people = $derived(data.people);
  let isBoard = $derived(data.user?.roles?.includes("board") ?? false);
  let showAll = $derived(page.url.searchParams.has("all"));

  let query = $state("");
  let roleFilter = $state<string | null>(null);

  let filtered = $derived(
    people.filter((p) => {
      if (roleFilter && !p.roles.includes(roleFilter)) return false;
      if (!query.trim()) return true;
      const needle = query.toLowerCase();
      return (
        p.name?.toLowerCase().includes(needle) ||
        p.firstname?.toLowerCase().includes(needle) ||
        p.lastname?.toLowerCase().includes(needle) ||
        p.email?.toLowerCase().includes(needle) ||
        p.phone?.toLowerCase().includes(needle) ||
        p.roles.some((r) => r.toLowerCase().includes(needle))
      );
    }),
  );

  const link = (p: { id: number; name: string; roles: string[] }) =>
    p.roles.includes("member") ? `/m/${p.name.toLowerCase()}` : `/m/${p.id}`;

  function setTab(all: boolean) {
    goto(all ? "?all" : "?", { keepFocus: true, noScroll: true });
  }
</script>

<svelte:head>
  <title>Members</title>
</svelte:head>

<PageShell>
  <div class="head">
    <Tabs>
      <Tab
        active={!showAll}
        count={people.filter((p) => p.roles.includes("member")).length}
        onclick={() => setTab(false)}
      >
        Members
      </Tab>
      <Tab active={showAll} count={people.length} onclick={() => setTab(true)}>
        Everyone
      </Tab>
    </Tabs>

    {#if isBoard}
      <Button variant="primary" onclick={() => goto("/m/+new")}
        >+ New member</Button
      >
    {/if}
  </div>

  <div class="filters">
    <SearchInput bind:value={query} placeholder="Search name, email, role…" />
    <div class="pills">
      {#each ROLE_NAMES as role (role)}
        <Pill
          active={roleFilter === role}
          onclick={() => (roleFilter = roleFilter === role ? null : role)}
        >
          {role}
        </Pill>
      {/each}
    </div>
  </div>

  {#if filtered.length === 0}
    <EmptyState>Nobody here yet.</EmptyState>
  {:else}
    <div class="desktop">
      <DataTable>
        {#snippet head()}
          <tr>
            <th>Name</th>
            <th class="col-email">Email</th>
            <th class="col-phone">Phone</th>
            <th class="col-city">City</th>
            <th class="col-full">Full name</th>
            <th>Roles</th>
          </tr>
        {/snippet}
        {#snippet body()}
          {#each filtered as p (p.id)}
            <tr
              class="clickable"
              role="button"
              tabindex="0"
              onclick={() => goto(link(p))}
              onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goto(link(p));
                }
              }}
            >
              <td class="td-name">{p.name}</td>
              <td class="td-dim col-email">{p.email ?? ""}</td>
              <td class="td-dim col-phone">{p.phone ?? ""}</td>
              <td class="td-dim col-city">{p.city ?? ""}</td>
              <td class="td-dim col-full">
                {[p.firstname, p.lastname].filter(Boolean).join(" ")}
              </td>
              <td>
                <div class="roles">
                  {#each p.roles as role (role)}
                    <Chip {role} />
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        {/snippet}
      </DataTable>
    </div>

    <div class="mobile">
      {#each filtered as p (p.id)}
        <MemberCard
          name={p.name}
          fullName={[p.firstname, p.lastname].filter(Boolean).join(" ") ||
            undefined}
          city={p.city}
          email={p.email}
          phone={p.phone}
          roles={p.roles}
          onclick={() => goto(link(p))}
        />
      {/each}
    </div>
  {/if}
</PageShell>

<style>
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    gap: 12px;
  }
  .filters {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .pills {
    display: flex;
    flex-wrap: nowrap;
    gap: 5px;
    align-items: center;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: none;
  }
  .pills::-webkit-scrollbar {
    display: none;
  }
  .roles {
    display: flex;
    gap: 4px;
    flex-wrap: nowrap;
    align-items: center;
  }
  .desktop {
    display: block;
  }
  .mobile {
    display: none;
    flex-direction: column;
    gap: 8px;
  }
  @media (max-width: 960px) {
    :global(.col-city),
    :global(.col-full) {
      display: none;
    }
  }
  @media (max-width: 720px) {
    :global(.col-phone) {
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
