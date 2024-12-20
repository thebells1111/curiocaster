<script>
	import PlayingImg from './PlayingImg.svelte';

	import Player from '$lib/Shared/Player/Player.svelte';
	import WalletControls from './WalletControls.svelte';
	import ControlsOverlay from './ControlsOverlay.svelte';

	import {
		playingPodcast,
		playingEpisode,
		playingEpisodeChapters,
		chapterIndex,
		chapterDisplayImage,
		mediaSession,
		showMobile,
		showCC,
		playingEpisodeTranscript,
		transcriptIndex,
		playerIsPaused,
		showVideo,
		goFullscreen,
		player,
		remoteLiveSplits,
		useDefaultChapter
	} from '$/stores';

	$: $chapterDisplayImage =
		$playingEpisode &&
		$playingEpisodeChapters &&
		$chapterIndex &&
		!$useDefaultChapter &&
		$playingEpisodeChapters[$chapterIndex]?.img;

	$: if ($chapterDisplayImage && $mediaSession) {
		$mediaSession.metadata = new MediaMetadata({
			title: $playingPodcast.title,
			artist: $playingEpisode.title,
			artwork: [
				{
					src: $chapterDisplayImage,
					sizes: '512x512',
					type: 'image/png'
				}
			]
		});
	}

	$: chapter =
		$chapterIndex > -1 &&
		$playingEpisode &&
		$playingEpisodeChapters &&
		!$useDefaultChapter &&
		$playingEpisodeChapters[$chapterIndex];

	let imageNode;

	let showOverlay = true;

	let fadeTimeout;

	function handleMouseMove() {
		if (!$showMobile) {
			showOverlay = true;
			if (fadeTimeout) {
				clearTimeout(fadeTimeout);
			}
		}
	}

	function handleMouseLeave() {
		if (!$showMobile) {
			startFade(500);
		}
	}

	function handleOverlayTouch() {
		startFade(2500);
	}

	function handleOverlayMove() {
		startFade(2500);
	}

	function handleShowOverlayTouch() {
		showOverlay = true;
		startFade(2500);
	}

	function startFade(time) {
		if (fadeTimeout) {
			clearTimeout(fadeTimeout);
		}
		fadeTimeout = setTimeout(() => {
			showOverlay = false;
		}, time);
	}

	$: if ($playerIsPaused) {
		showOverlay = true;
	} else if ($player) {
		startFade(2500);
	}

	let overlayWidth = 0;
</script>

<div
	class="container"
	class:logo={!($playingPodcast?.artwork || $playingPodcast?.image)}
	class:fullscreen={$goFullscreen}
>
	<div class="player" class:hide={!$showVideo}>
		<Player />
	</div>
	<div
		class="img-container"
		class:show-background={showOverlay}
		class:hide={$showVideo}
		class:show-mobile={$showMobile}
	>
		<div
			class="overlay-clicker"
			class:desktop={!$showMobile}
			on:mousemove={handleMouseMove}
			on:touchend|preventDefault={handleShowOverlayTouch}
		/>
		<div
			class="overlay-container"
			class:desktop={!$showMobile}
			class:show-overlay={showOverlay}
			on:mouseleave={handleMouseLeave}
			on:mousemove={handleMouseMove}
			on:touchstart={handleOverlayTouch}
			on:touchmove={handleOverlayMove}
		>
			<ControlsOverlay />
		</div>
		<div class="playing-img-container">
			<PlayingImg bind:imageNode />
		</div>
		{#if $showCC && $playingEpisodeTranscript && !$playerIsPaused}
			<div class="cc-container" on:mousemove={handleMouseMove} class:cc-desktop={!$showMobile}>
				<div class="cc">
					{@html $playingEpisodeTranscript?.[$transcriptIndex]?.text || ''}
				</div>
			</div>
		{/if}
	</div>
	{#if !$goFullscreen}
		<WalletControls />
	{/if}

	<div class="chapter-titles">
		{#if chapter?.url}
			<a href={chapter.url} target="_blank" rel="noopener noreferrer">
				{chapter && chapter.title
					? chapter.title
					: $showMobile
					? ''
					: $playingPodcast && $playingPodcast.title}</a
			>
		{:else if $remoteLiveSplits && Object.keys($remoteLiveSplits)?.length > 0}
			<remote-item>
				{#if $remoteLiveSplits?.title}
					<h3>{$remoteLiveSplits?.title || ''}</h3>
				{/if}
				{#if $remoteLiveSplits?.line?.[1]}
					<p>by {$remoteLiveSplits?.line?.[1]}</p>
				{/if}
				{#if $remoteLiveSplits?.line?.[0]}
					<p>on {$remoteLiveSplits?.line?.[0] || ''}</p>
				{/if}
			</remote-item>
		{:else}
			<p>
				{chapter && chapter.title
					? chapter.title
					: $showMobile
					? ''
					: ($playingEpisode && $playingEpisode.title) || ''}
			</p>
		{/if}
	</div>
</div>

<style>
	.container {
		width: 100%;
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		overflow: auto;
		overflow-x: hidden;
		position: relative;
		opacity: 1;
		transition: opacity 0.3s;
		height: 100%;
	}

	.player {
		max-width: calc(100% - 8px);
		max-height: calc(100% - 200px);
	}

	.img-container {
		width: calc(100% - 4px);
		height: 400px;
		position: relative;
		display: grid;
		place-content: center;
		background-color: transparent;
		border-radius: 8px;
		transition: background-color 0.3s linear;
	}

	.img-container.show-mobile {
		height: 320px;
	}
	.show-background {
		background-color: var(--image-container-overlay-background);
		transition: background-color 0.1s linear;
	}

	.overlay-clicker {
		min-height: 100%;
		min-width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		z-index: 2;
	}

	.playing-img-container {
		filter: drop-shadow(0px 2px 3px #000);
	}

	.overlay-container {
		position: absolute;
		top: 0;
		border-radius: 8px;
		width: 100%;
		height: 100%;
		z-index: 3;
		visibility: hidden;
		opacity: 0;
		transition: visibility 0s 0.3s, opacity 0.3s linear;
	}

	.desktop {
		min-width: 400px;
		width: 400px;
		left: calc(50% - 200px);
	}

	.show-overlay {
		visibility: visible;
		opacity: 1;
		transition: opacity 0.1s linear;
	}

	.fullscreen {
		position: initial;
	}
	.logo {
		justify-content: center;
	}

	.chapter-titles {
		width: 100%;
		height: 100px;
		display: grid;
		place-items: center;
		flex-shrink: 1;
		margin-top: 8px;
	}

	p {
		font-size: 1.2em;
		font-weight: 700;
		color: var(--primary-text-color);
		padding: 0;
		text-align: center;
	}

	a {
		font-size: 1.2em;
		font-weight: 700;
		padding: 0;
		text-align: center;
	}

	.hide {
		display: none;
	}

	.cc-container {
		position: absolute;
		bottom: 40px;
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		z-index: 9;
	}

	.cc-desktop {
		width: 400px;
		left: calc(50% - 200px);
	}
	.cc {
		color: white;
		background-color: rgba(0, 0, 0, 0.75);
		margin: 0 auto;
		display: inline-block;
		padding: 4px 8px;
		text-align: center;
	}

	.hide {
		display: none;
	}

	remote-item p {
		margin: 0 0 8px 0;
		font-size: 1em;
	}

	remote-item h3 {
		color: var(--primary-text-color);
		text-align: center;
	}
</style>
