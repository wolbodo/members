<script context="module">
  export async function preload(page) {
    const { slug } = page.params;
    return { slug };
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte';
  import Button from '$components/Button.svelte';
  export let slug;
  async function getMembers() {
    const res = await fetch(`../members.json`);
    const json = await res.json();

    if (res.ok) {
      return json;
    } else {
      throw new Error(json);
    }
  }
  let promise = getMembers()
    .then((members) =>
      members.find((m) => m.name.toLowerCase() === slug.toLowerCase())
    )
    .catch((err) => console.log(err));
</script>

<Button href="/">Back</Button>
{#await promise}
  <h1>...waiting on member</h1>
{:then member}
  <h1>{member.name}</h1>
  <pre>{JSON.stringify(member, null, 2)}</pre>
{:catch error}
  <p style="color: red">{error}</p>
{/await}
