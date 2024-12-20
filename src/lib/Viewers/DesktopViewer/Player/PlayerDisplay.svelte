<script>
	import { onMount } from 'svelte';
	import PlayingImg from '$lib/Shared/NowPlaying/PlayingImg.svelte';
	import PreviousChapter from '$lib/Shared/Player/PreviousChapter.svelte';
	import RewindButton from '$lib/Shared/Player/RewindButton.svelte';
	import PlayPauseButton from '$lib/Shared/Player/PlayPauseButton.svelte';
	import FastFowardButton from '$lib/Shared/Player/FastFowardButton.svelte';
	import NextChapter from '$lib/Shared/Player/NextChapter.svelte';
	import AudioProgressBar from '$lib/Shared/Player/AudioProgressBar.svelte';
	import PlayingText from '$lib/Shared/Player/PlayingText.svelte';
	import VolumeControls from '$lib/Shared/Player/VolumeControls.svelte';
	import PlayerTime from '$lib/Shared/Player/PlayerTime.svelte';
	import PlayerDuration from '$lib/Shared/Player/PlayerDuration.svelte';

	import {
		playingEpisodeChapters,
		playingPodcast,
		playerTime,
		playerDuration,
		rightPane,
		currentDesktopView,
		selectedEpisode,
		playingEpisode,
		selectedPodcast,
		episodesList,
		logoBackground,
		showSubscriptionShowNotes,
		deviceType
	} from '$/stores';

	async function loadNowPlaying() {
		$currentDesktopView = 'nowPlaying';
		$showSubscriptionShowNotes = false;
	}

	let loaded = false;

	onMount(() => {
		loaded = true;
	});
</script>

<!-- svelte-ignore a11y-media-has-caption-->
<div class="container">
	<div class="player-card">
		<div class="progress-bar">
			{#if $playingPodcast?.title}
				<AudioProgressBar
					trackerColor={'var(--audio-progress-tracker)'}
					handleColor={'var(--audio-progress-handle)'}
					elapsedColor={'var(--audio-progress-elapsed)'}
				/>
			{:else}
				<div style="height:48px" />
			{/if}

			<div class="episode-info">
				<div class="playing-text">
					<PlayingText />
				</div>
			</div>
		</div>

		<div class="bottom-bar">
			{#if loaded}
				<div class="img-sizer" on:click={loadNowPlaying}>
					<PlayingImg />
				</div>
				<div class="control-buttons">
					{#if $playingEpisodeChapters?.length > 0}
						<PreviousChapter size={$deviceType === 'tablet' ? '54' : '36'} />
					{/if}
					<RewindButton size={$deviceType === 'tablet' ? '48' : '30'} />
					<PlayPauseButton size={$deviceType === 'tablet' ? '48' : '30'} />
					<FastFowardButton size={$deviceType === 'tablet' ? '48' : '30'} />
					{#if $playingEpisodeChapters?.length > 0}
						<NextChapter size={$deviceType === 'tablet' ? '54' : '36'} />
					{/if}
				</div>
			{/if}

			<div class="duration">
				{#if $playingPodcast?.title && $playerTime > -1 && $playerDuration > -1}
					<PlayerTime />
					{#if !($playingEpisode.liveStatus === 'live')}
						<span class="slash"> / </span>
						<PlayerDuration />
					{/if}
				{/if}
			</div>

			<div class="volume">
				<VolumeControls />
			</div>
		</div>
	</div>
</div>

<style>
	div {
		width: 100%;
		user-select: none;
	}
	.container {
		background-color: var(--player-background-color);
		color: var(--primary-text-color);
	}

	.player-card {
		width: 100%;
		height: 116px;
		background-color: var(--player-card-color);
		color: var(--primary-text-color);
		border-radius: 8px;
	}

	.progress-bar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	.bottom-bar {
		display: flex;
		flex-direction: row;
		align-content: center;
		justify-content: center;
		width: 100%;
		position: relative;
	}

	.control-buttons {
		margin-left: 8px;
		display: inline-flex;
		align-items: center;
		z-index: 2;
	}

	.episode-info {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		top: 25px;
	}

	.playing-text {
		margin: 0 64px;
		display: flex;
		justify-content: center;
		height: 23px;
	}

	.duration {
		display: flex;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 0px;
	}

	.slash {
		margin: 0 4px;
	}

	.volume {
		display: flex;
		justify-content: flex-end;
		padding-right: 12px;
		z-index: 2;
	}

	.img-sizer {
		max-width: 60px;
		transform: scale(1);
		transition-duration: 0.2s;
		border-radius: 6px;
		filter: drop-shadow(0px 1px 3px #000);
		margin: 0 0 0 8px;
		position: relative;
		bottom: 8px;
		z-index: 2;
	}

	.img-sizer:hover {
		transform: scale(1.1);
		transition-duration: 0.2s;
		z-index: 100;
		cursor: pointer;
	}

	:global(html[data-theme='dark'] .player-card) {
		border-radius: 0;
	}
</style>
