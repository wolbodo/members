<script lang="ts">
	import { Html, Head, Body, Container, Heading, Text, Hr } from 'svelte-email';
	import type { Snippet } from 'svelte';

	interface Props {
		subject: string;
		header?: Snippet;
		children?: Snippet;
	}

	let { subject, header, children }: Props = $props();

	const sans = 'Rubik, Arial, sans-serif';
	const c = {
		bg: '#edf0f8',
		surface: '#ffffff',
		ink: '#333333'
	};
</script>

<Html lang="nl">
	<Head>
		<title>{subject}</title>
	</Head>
	<Body style={{ margin: '0', padding: '40px', backgroundColor: c.bg, fontFamily: sans }}>
		<Container style={{ backgroundColor: c.surface, padding: '40px', maxWidth: '600px' }}>
			{#if header}
				<Heading
					as="h1"
					style={{ fontFamily: sans, fontSize: '24px', color: c.ink, margin: '0 0 24px' }}
				>
					{@render header()}
				</Heading>
			{/if}

			<Hr style={{ margin: '0 0 24px' }} />

			<Text style={{ fontSize: '16px', lineHeight: '1.6', color: c.ink }}>
				{@render children?.()}
			</Text>
		</Container>
	</Body>
</Html>
