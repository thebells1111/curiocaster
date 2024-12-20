<script>
	import DeleteIcon from '$lib/icons/Delete.svelte';
	import PlayArrow from '$lib/icons/PlayArrow.svelte';
	import Pause from '$lib/icons/Pause.svelte';

	import loadEpisode from '$functions/loadEpisode';

	import {
		userState,
		userStateDB,
		player,
		playerIsPaused,
		selectedEpisode,
		playingEpisode,
		rightPane,
		showNotesPane,
		middlePane,
		playingList,
		selectedPlayingList,
		showMobile,
		swiper
	} from '$/stores';

	async function playEpisode(episode) {
		console.log(episode);
		$selectedPlayingList = 'playlist';
		$playingList = $userState.playlist;
		let id = episode.guid;
		selectEpisode(episode);

		if ($playingEpisode?.title === episode?.title) {
			if (!$playerIsPaused) {
				$player.pause();
			} else {
				$player.play();
				if (!$showMobile) {
					$middlePane = 'nowPlaying';
				} else if ($swiper) {
					$swiper.slideTo(0);
				}
			}
		} else {
			loadEpisode(episode, episode.podcast, $selectedPlayingList);

			if ($swiper) {
				$swiper.slideTo(0);
			}
		}
	}

	function deleteEpisode(index) {
		$userState.playlist.splice(index, 1);
		$userState = $userState;
		userStateDB.setItem('userState', $userState);
	}

	function selectEpisode(episode) {
		$rightPane = 'showNotes';
		if ($showNotesPane) {
			$showNotesPane.scrollTop = 0;
		}
		$selectedEpisode = episode;
	}
</script>

<h3>Queue</h3>
<ul>
	{#each ($userState && $userState.playlist) || [] as episode, index}
		<li>
			{`${index + 1}.`}
			<button class="playlist-play-button" on:click={playEpisode.bind(this, episode)}>
				{#if $playingEpisode?.title === episode?.title && !$playerIsPaused}
					<Pause size="36px" />
				{:else}
					<PlayArrow size="36px" />
				{/if}</button
			>
			<div on:click={selectEpisode.bind(this, episode)}>
				{episode.podcast.title}
				-
				{episode.title}
			</div>

			<button on:click={deleteEpisode.bind(this, index)}><DeleteIcon size="24px" /></button>
		</li>
	{/each}
</ul>

<style>
	h3 {
		color: var(--primary-text-color);
		margin: 8px;
		text-align: center;
	}
	li {
		display: flex;
		align-items: center;
		padding-left: 8px;
		padding-bottom: 0.5em;
		margin-right: 8px;
		border-bottom: 1px solid var(--border-color);
		color: var(--primary-text-color);
		position: relative;
	}

	li > div {
		width: 100%;
		position: relative;
	}

	li > div {
		width: 100%;
	}

	button {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 36px;
		margin: 0 8px;
		position: relative;
		top: 4px;
	}

	:global(.playlist-play-button:hover > svg) {
		color: var(--primary-text-color);
		transform: scale(1.2);
		transition-duration: 0.2s;
	}
</style>
