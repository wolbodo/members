<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Button } from '$lib';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	const token = $derived(page.url.searchParams.get('token') ?? '');
</script>

<svelte:head>
	<title>Set new password — Wolbodo Members</title>
</svelte:head>

<div class="login-page">
	<div class="card">
		<div class="top">
			<svg class="wmark" width="40" height="32" viewBox="0 0 22 17" fill="none" aria-hidden="true">
				<path
					d="M1.5 2.5L5.5 14.5L11 5.5L16.5 14.5L20.5 2.5"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<h1 class="title">new <span>password</span></h1>
			<p class="sub">Pick something you can remember.</p>
		</div>

		<form class="form" method="post" use:enhance>
			<div class="group">
				<label class="label" for="password">Password</label>
				<input
					class="input"
					id="password"
					name="password"
					type="password"
					autocomplete="new-password"
					required
				/>
			</div>

			<input type="hidden" name="token" value={token} />

			{#if form?.error}
				<p class="err">{form.error}</p>
			{/if}

			<div class="actions">
				<a class="back" href="/auth/login">Back to log in</a>
				<Button type="submit">Save password</Button>
			</div>
		</form>
	</div>
</div>

<style>
	.login-page {
		min-height: calc(100vh - 54px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
	}
	.card {
		width: 100%;
		max-width: 360px;
	}
	.top {
		text-align: center;
		margin-bottom: 30px;
	}
	.wmark {
		color: var(--pri);
		display: inline-block;
		margin-bottom: 14px;
	}
	.title {
		font-size: var(--text-2xl);
		font-weight: 800;
		letter-spacing: -0.025em;
		line-height: 1;
		margin-bottom: 6px;
	}
	.title span {
		color: var(--pri);
	}
	.sub {
		font-size: var(--text-sm);
		color: var(--txt3);
	}
	.form {
		background: var(--bg-s);
		border: 1px solid var(--bd-m);
		border-radius: 12px;
		padding: 26px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.label {
		font-size: var(--text-xs);
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--txt2);
	}
	.input {
		background: var(--bg-c);
		border: 1px solid var(--bd-m);
		border-radius: var(--r-md);
		padding: 10px 12px;
		color: var(--txt);
		font-family: var(--font-body);
		font-size: var(--text-base);
		outline: none;
		transition: border-color var(--t-fast);
	}
	.input:focus {
		border-color: var(--pri-bd);
		box-shadow: 0 0 0 3px var(--pri-bg);
	}
	.actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.back {
		color: var(--txt3);
		font-size: var(--text-sm);
		transition: color var(--t-fast);
	}
	.back:hover {
		color: var(--pri);
	}
	.err {
		font-size: var(--text-sm);
		color: var(--red);
		padding: 8px 12px;
		background: rgba(224, 85, 85, 0.08);
		border: 1px solid rgba(224, 85, 85, 0.2);
		border-radius: 6px;
		margin: 0;
	}
</style>
