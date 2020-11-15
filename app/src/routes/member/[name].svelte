<script context="module">
  import { members } from '../../stores/members';

  export async function preload(page) {
    const { name } = page.params;

    if (members) member = members.find((m) => m.name == name)[0];

    return { member };
  }
</script>

<script>
  export let member;
</script>

<h1>{member}</h1>
