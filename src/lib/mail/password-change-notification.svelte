<script lang="ts">
	import Template from './Template.svelte';

	interface Props {
		person: { name: string };
	}

	let { person }: Props = $props();
</script>

<Template subject="Your password has changed">
	{#snippet header()}Hi {person.name},{/snippet}

	Just letting you know, your Wolbodo password has changed.
</Template>
