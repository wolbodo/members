<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { session } from '$app/stores';

	onMount(async () => {
		console.log('Logging out');
		await fetch('/auth/logout', { method: 'post' });
		console.log('Logging out ok');

		console.log('Redirecting');
		$session = {};
		goto('/login');
	});
</script>
