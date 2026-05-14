<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import AppHeader from "./AppHeader.svelte";
  import UserChip from "../UserChip/UserChip.svelte";

  const { Story } = defineMeta({
    title: "Composite/AppHeader",
    component: AppHeader,
    parameters: { layout: "fullscreen" },
  });

  const nav = [
    { label: "Members", href: "/", active: true },
    { label: "Changes", href: "/changes" },
    { label: "Mail", href: "/mail" },
  ];
</script>

<Story name="With user chip" args={{ nav }}>
  {#snippet template(args)}
    <AppHeader {...args}>
      {#snippet trailing()}
        <UserChip name="Klaas">
          {#snippet menu()}
            <button>My profile</button>
            <hr />
            <button class="danger">Log out</button>
          {/snippet}
        </UserChip>
      {/snippet}
    </AppHeader>
  {/snippet}
</Story>
