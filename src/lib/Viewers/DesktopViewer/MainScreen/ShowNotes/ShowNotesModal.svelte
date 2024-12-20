<script>
	import { fly } from 'svelte/transition';

	import { showSubscriptionShowNotes, showRecentEpisodes } from '$/stores';

	import ShowNotes from './ShowNotes.svelte';

	import CancelFilled from '$lib/icons/CancelFilled.svelte';
	export let nowPlaying = false;
</script>

{#if $showSubscriptionShowNotes}
	<div class="shownotes" transition:fly={{ y: 420, x: 420, duration: 400 }}>
		<ShowNotes {nowPlaying} />
		<div
			class="cancel"
			on:click={() => {
				$showSubscriptionShowNotes = !$showSubscriptionShowNotes;
			}}
		>
			<CancelFilled size="27px" />
		</div>
	</div>
{/if}

<style>
	.shownotes {
		position: absolute;
		width: 400px;
		height: 100%;
		bottom: 2px;
		right: 8px;
		z-index: 3;
	}

	.cancel {
		position: absolute;
		right: -8px;
		top: 0;
		color: var(--primary-text-color);
		cursor: pointer;
	}
</style>
