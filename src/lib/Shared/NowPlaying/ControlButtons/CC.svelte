<script>
	import ClosedCaption from '$lib/icons/ClosedCaption.svelte';
	import ClosedCaptionDisabled from '$lib/icons/ClosedCaptionDisabled.svelte';

	import { showCC } from '$/stores';
</script>

<button on:click={() => ($showCC = !$showCC)} class="icon-button">
	{#if $showCC}
		<ClosedCaption size="32" />
	{:else}
		<ClosedCaptionDisabled size="32" />
	{/if}
</button>

<style>
	.icon-button,
	.icon-button:active {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 42px;
		margin: 0;
		color: white;
		transform: scale(1);
		transition-duration: 0.2s;
	}

	.icon-button:hover {
		transform: scale(1.2);
		transition-duration: 0.2s;
	}
</style>
