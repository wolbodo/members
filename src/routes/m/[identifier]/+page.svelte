<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { superForm } from "sveltekit-superforms";
  import { datetime, formatDate } from "$lib/format";
  import {
    PageShell,
    ProfileHeader,
    FormSection,
    Field,
    TextInput,
    TextValue,
    Textarea,
    Toggle,
    Tag,
    AddTag,
    Button,
    SaveBar,
    EmptyState,
  } from "$lib";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let person = $derived(data.person);
  let isBoard = $derived(data.isBoard);
  let isSelf = $derived(data.isSelf);
  let canEdit = $derived(isBoard || isSelf);

  let activeRoles = $derived(data.roles.filter((r) => !r.valid_till));
  let pastRoles = $derived(data.roles.filter((r) => r.valid_till));
  let primaryRole = $derived(activeRoles[0]?.role ?? "member");
  let memberRole = $derived(activeRoles.find((r) => r.role === "member"));
  let memberSince = $derived(
    memberRole?.valid_from ? formatDate(String(memberRole.valid_from)) : null,
  );

  const {
    form: editForm,
    errors: editErrors,
    enhance: editEnhance,
    tainted,
    // svelte-ignore state_referenced_locally
  } = superForm(data.form, {
    dataType: "json",
    resetForm: false,
    onUpdated: ({ form }) => {
      if (form.valid) {
        saved = true;
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(() => (saved = false), 2500);
      }
    },
  });

  let dirty = $derived(!!$tainted);
  let saved = $state(false);
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
</script>

<svelte:head>
  <title>{person?.name ?? "Member"} — Wolbodo Members</title>
</svelte:head>

<PageShell maxWidth="800px">
  {#if !person}
    <EmptyState>Person not found.</EmptyState>
  {:else}
    <Button variant="back" onclick={() => goto("/")}>← members</Button>

    <ProfileHeader
      name={person.name}
      realName={[person.firstname, person.lastname].filter(Boolean).join(" ") ||
        undefined}
      since={memberSince ?? undefined}
      id={person.id}
      {primaryRole}
    />

    <div class="roles">
      {#each activeRoles as r (r.id)}
        {#if isBoard}
          <form
            method="post"
            action="?/stopRole"
            use:enhance
            style="display:inline-flex"
          >
            <input type="hidden" name="roleId" value={r.id} />
            <Tag
              role={r.role}
              since={r.valid_from
                ? formatDate(String(r.valid_from))
                : undefined}
              onremove={() => {
                (document.activeElement as HTMLButtonElement)
                  ?.closest("form")
                  ?.requestSubmit();
              }}
            />
          </form>
        {:else}
          <Tag
            role={r.role}
            since={r.valid_from ? formatDate(String(r.valid_from)) : undefined}
          />
        {/if}
      {/each}

      {#if isBoard}
        <form
          method="post"
          action="?/addRole"
          use:enhance
          style="display:inline-flex"
        >
          <input type="hidden" name="personId" value={person.id} />
          <AddTag
            onadd={(role) => {
              const form = document.createElement("input");
              form.type = "hidden";
              form.name = "role";
              form.value = role;
              // the form just below contains personId; we submit by appending role
              const realForm = (document.activeElement as HTMLElement)?.closest(
                "form",
              );
              if (realForm) {
                const existing = realForm.querySelector("input[name=role]");
                if (existing) existing.remove();
                realForm.appendChild(form);
                realForm.requestSubmit();
              }
            }}
          />
        </form>
      {/if}
    </div>

    <form method="post" action="?/edit" use:editEnhance>
      <FormSection label="Identity">
        <Field label="Nickname" span2 error={$editErrors.name?.[0]}>
          {#if canEdit && isBoard}
            <TextInput bind:value={$editForm.name} />
          {:else}
            <TextValue value={person.name} />
          {/if}
        </Field>
        <Field label="First name" error={$editErrors.firstname?.[0]}>
          {#if canEdit && isBoard}
            <TextInput bind:value={$editForm.firstname as string} />
          {:else}
            <TextValue value={person.firstname} />
          {/if}
        </Field>
        <Field label="Last name" error={$editErrors.lastname?.[0]}>
          {#if canEdit && isBoard}
            <TextInput bind:value={$editForm.lastname as string} />
          {:else}
            <TextValue value={person.lastname} />
          {/if}
        </Field>
      </FormSection>

      <FormSection label="Contact">
        <Field label="Email" error={$editErrors.email?.[0]}>
          {#if canEdit}
            <TextInput type="email" bind:value={$editForm.email as string} />
          {:else}
            <TextValue value={person.email} />
          {/if}
        </Field>
        <Field label="Phone" error={$editErrors.phone?.[0]}>
          {#if canEdit}
            <TextInput type="tel" bind:value={$editForm.phone as string} />
          {:else}
            <TextValue value={person.phone} />
          {/if}
        </Field>
      </FormSection>

      <FormSection label="Location">
        <Field label="Address" span2 error={$editErrors.address?.[0]}>
          {#if canEdit}
            <TextInput bind:value={$editForm.address as string} />
          {:else}
            <TextValue value={person.address} />
          {/if}
        </Field>
        <Field label="Zipcode" error={$editErrors.zipcode?.[0]}>
          {#if canEdit}
            <TextInput bind:value={$editForm.zipcode as string} />
          {:else}
            <TextValue value={person.zipcode} />
          {/if}
        </Field>
        <Field label="City" error={$editErrors.city?.[0]}>
          {#if canEdit}
            <TextInput bind:value={$editForm.city as string} />
          {:else}
            <TextValue value={person.city} />
          {/if}
        </Field>
        <Field label="Country" span2 error={$editErrors.country?.[0]}>
          {#if canEdit}
            <TextInput bind:value={$editForm.country as string} />
          {:else}
            <TextValue value={person.country} />
          {/if}
        </Field>
      </FormSection>

      {#if isBoard || isSelf}
        <FormSection label="System">
          <Field label="Bank account" error={$editErrors.bankaccount?.[0]}>
            {#if canEdit}
              <TextInput bind:value={$editForm.bankaccount as string} />
            {:else}
              <TextValue value={person.bankaccount} mono />
            {/if}
          </Field>
          {#if isBoard}
            <Field label="Key code" error={$editErrors.key_code?.[0]}>
              {#if canEdit}
                <TextInput bind:value={$editForm.key_code as string} />
              {:else}
                <TextValue value={person.key_code} mono />
              {/if}
            </Field>
          {/if}
          <Field label="Permissions" span2>
            <div style="display:flex; gap:20px; padding:6px 0; flex-wrap:wrap;">
              <Toggle
                bind:checked={$editForm.allow_register as boolean}
                disabled={!isBoard}
              >
                Allow register
              </Toggle>
              <Toggle
                bind:checked={$editForm.allow_door as boolean}
                disabled={!isBoard}
              >
                Allow door
              </Toggle>
            </div>
          </Field>
          {#if canEdit}
            <Field label="New password" span2 error={$editErrors.password?.[0]}>
              <TextInput
                type="password"
                bind:value={$editForm.password as string}
                placeholder="Leave empty to keep"
              />
            </Field>
          {/if}
        </FormSection>
      {/if}

      {#if isBoard || isSelf}
        <FormSection label="Notes">
          <Field label="Note" span2 error={$editErrors.note?.[0]}>
            {#if isBoard}
              <Textarea bind:value={$editForm.note as string} />
            {:else}
              <TextValue value={person.note} />
            {/if}
          </Field>
        </FormSection>
      {/if}

      {#if pastRoles.length > 0}
        <FormSection label="Role history">
          <div class="rh" style="grid-column:1/-1">
            {#each pastRoles as r (r.id)}
              <div class="rh-item">
                <span class="rh-role">{r.role}</span>
                <span class="rh-range t-small">
                  {r.valid_from ? formatDate(String(r.valid_from)) : "?"} →
                  {r.valid_till ? formatDate(String(r.valid_till)) : "?"}
                </span>
              </div>
            {/each}
          </div>
        </FormSection>
      {/if}

      <div class="meta">
        <span class="t-dimmer">created: {datetime(String(person.created))}</span
        >
        <span class="t-dimmer"
          >modified: {datetime(String(person.modified))}</span
        >
      </div>

      {#if canEdit && (dirty || saved)}
        <div class="save-wrap">
          {#if saved && !dirty}
            <SaveBar state="saved" message="Saved" />
          {:else}
            <SaveBar
              state="dirty"
              message="Unsaved changes"
              ondiscard={() => location.reload()}
              onsave={() => {
                const form = (document.activeElement as HTMLElement)?.closest(
                  "form",
                );
                (
                  form ?? document.querySelector('form[action="?/edit"]')
                )?.requestSubmit();
              }}
            />
          {/if}
        </div>
      {/if}
    </form>
  {/if}
</PageShell>

<style>
  .roles {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-bottom: 28px;
  }
  .rh {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
  }
  .rh-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 8px 12px;
    background: var(--bg-s);
    border-radius: 7px;
    opacity: 0.65;
  }
  .rh-role {
    font-size: var(--text-sm);
    font-weight: 700;
    min-width: 90px;
  }
  .meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 24px;
    font-size: var(--text-xs);
  }
  .save-wrap {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 500;
  }
  @media (max-width: 600px) {
    .save-wrap {
      left: 14px;
      right: 14px;
      bottom: 14px;
      transform: none;
    }
    .save-wrap :global(.sb) {
      width: 100%;
    }
  }
</style>
