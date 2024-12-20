<script>
	import Share from '$lib/icons/Share.svelte';

	import { showShareClip } from '$/stores';
</script>

<div class="icon-container share">
	<button class="icon-button share" on:click={() => ($showShareClip = true)}
		><Share size="16" />
		<p>Share</p></button
	>
</div>

<style>
	.icon-container {
		width: 42px;
	}

	.icon-button {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 42px;
		margin: 0;
		color: var(--primary-text-color);
		transform: scale(1);
		transition-duration: 0.2s;
		display: flex;
		align-self: flex-end;
	}

	/* .icon-button:hover {
    color: #111;
    transform: scale(1.2);
    transition-duration: 0.2s;
  } */

	.icon-button.share {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.icon-button.share > p {
		padding: 0;
		margin: 0;
		font-size: 0.8em;
	}
</style>
