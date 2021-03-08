<script context="module">
  import Button from "./KarelButton.svelte";
  export async function preload(page) {
    const { name } = page.params;
    return { name };
  }
</script>

<script>
  import { members } from "$components/members";
  export let name;

  $: member = $members.data.find(
    (member) => member.name.toLowerCase() == name.toLowerCase()
  );
</script>

{#if $members.loading}
  <h1>...waiting on member</h1>
{:else if $members.error}
  <p style="color: red">{$members.error}</p>
{:else}
  <Button href="/">Back</Button>
  <h1>{member.name}</h1>
  <pre>{JSON.stringify(member, null, 2)}</pre>
{/if}
