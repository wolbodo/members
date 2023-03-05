<script lang="ts">
	export let checked: boolean;
</script>

<label>
	<section>
		<input type="checkbox" {...$$props} bind:checked on:change />
		<span />
	</section>
	<slot />
</label>

<style>
	/* The switch - the box around the slider */
	label {
		display: inline-block;
		line-height: 34px;
	}
	section {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	/* Hide default HTML checkbox */
	section input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	span {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--neutral-4);
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	span:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: var(--white);
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	input:checked + span {
		background-color: var(--primary-color);
	}

	input:focus + span {
		box-shadow: 0 0 1px var(--primary-color);
	}

	input:checked + span:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}
</style>
