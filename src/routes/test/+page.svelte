<script lang="ts">
	import { graphql } from '$houdini';

	$: allRoles = graphql(`
		query Test @load {
			roles: auth_person {
				id
			}
		}
	`);
</script>

<h1>H1</h1>

<pre>{JSON.stringify($allRoles, null, 2)}</pre>
