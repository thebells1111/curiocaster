<script>
	import savePlayingPodcastState from '$functions/savePlayingPodcastState';

	import { player, playerIsPaused, liveLoading } from '$/stores';
	import Play from '$lib/icons/PlayArrow.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	import Loading from '$lib/icons/LoadingRotate.svelte';
	export let size = 30;
	export let style = '';

	function handlePlayButton() {
		console.log($player.src);
		if (!$playerIsPaused) {
			$playerIsPaused = true;
		}
		if ($player && $player.paused && $player.src) {
			$player.play();
		} else if ($player && $player.src) {
			$player.pause();
		}
	}
</script>

{#if $liveLoading}
	<Loading {size} color={'var(--primary-text-color)'} />
{:else}
	<button on:click={handlePlayButton} aria-label="Play Pause" {style}>
		{#if $playerIsPaused}
			<Play {size} />
		{:else}
			<Pause {size} />
		{/if}
	</button>
{/if}

<style>
	button {
		border: none;
		padding: 0;
		margin: 0;
		background-color: transparent;
	}
</style>
