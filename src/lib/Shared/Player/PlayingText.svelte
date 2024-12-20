<script>
	import { playingEpisode, isPlayerLoaded, playingPodcast } from '$/stores';
</script>

<div class="playing-text">
	{$playingPodcast?.title && $playingEpisode?.title
		? `${$playingPodcast.title} - ${$playingEpisode.title}`
		: 'CurioCaster - The Best Podcast Player in Texas'}
</div>

<style>
	.playing-text {
		color: var(--primary-text-color);
	}
</style>
