<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<svelte:head>
	<title>Forgot password — Wolbodo Members</title>
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
			<h1 class="title">forgot <span>password</span></h1>
			<p class="sub">We'll send a reset link to your email.</p>
		</div>

		{#if form?.success}
			<div class="form">
				<p class="success">If the address exists in our database, you'll shortly have an email.</p>
				<div class="actions end">
					<a class="back" href="/auth/login">Back to log in</a>
				</div>
			</div>
		{:else}
			<form class="form" method="post" use:enhance>
				<div class="group">
					<label class="label" for="email">Email</label>
					<input
						class="input"
						id="email"
						name="email"
						type="email"
						placeholder="you@example.com"
						autocomplete="email"
						required
					/>
				</div>

				{#if form?.error}
					<p class="err">{form.error}</p>
				{/if}

				<div class="actions">
					<a class="back" href="/auth/login">Back to log in</a>
					<Button type="submit">Send link</Button>
				</div>
			</form>
		{/if}
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
	.input::placeholder {
		color: var(--txt3);
	}
	.actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.actions.end {
		justify-content: flex-end;
	}
	.back {
		color: var(--txt3);
		font-size: var(--text-sm);
		transition: color var(--t-fast);
	}
	.back:hover {
		color: var(--pri);
	}
	.success {
		font-size: var(--text-sm);
		color: var(--txt2);
		line-height: 1.55;
		padding: 9px 12px;
		background: var(--pri-bg);
		border: 1px solid var(--pri-bd);
		border-radius: 6px;
		margin: 0;
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
