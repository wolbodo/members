<script lang="ts">
  import Button from './common/button.svelte'
	let count: number = 0;

	const increment = () => {
		count += 1;
	};
</script>

<Button on:click={increment}>
	Clicks: {count}
</Button>
