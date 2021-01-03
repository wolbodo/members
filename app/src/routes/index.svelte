<script>
  import Button from '$components/Button.svelte';
  import List from '$components/List.svelte';
  async function getMembers() {
    const res = await fetch(`members.json`);
    const json = await res.json();

    if (res.ok) {
      return json;
    } else {
      throw new Error(json);
    }
  }
  let promise = getMembers().catch((err) => console.log(err));
</script>

{#await promise}
  <h1>...waiting on members</h1>
{:then members}
  <List {members} />
  <List {members} />
  <List {members} />
  <List {members} />
{:catch error}
  <p style="color: red">{error}</p>
{/await}
<div>
  <Button>Add member</Button>
</div>
