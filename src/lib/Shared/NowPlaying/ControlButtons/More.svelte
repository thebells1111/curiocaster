<script>
	import MoreVert from '$lib/icons/MoreVert.svelte';

	import { showSubscriptionShowNotes } from '$/stores';
</script>

<div class="icon-container more">
	<button
		class="icon-button more"
		on:click={() => ($showSubscriptionShowNotes = !$showSubscriptionShowNotes)}
		><MoreVert size="16" />
		<p>More</p></button
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

	.icon-button.more {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.icon-button.more > p {
		padding: 0;
		margin: 0;
		font-size: 0.8em;
	}
</style>
