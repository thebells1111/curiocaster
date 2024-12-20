<script>
	import PreviousChapter from '$lib/Shared/Player/PreviousChapter.svelte';
	import RewindButton from '$lib/Shared/Player/RewindButton.svelte';
	import PlayPauseButton from '$lib/Shared/Player/PlayPauseButton.svelte';
	import FastFowardButton from '$lib/Shared/Player/FastFowardButton.svelte';
	import NextChapter from '$lib/Shared/Player/NextChapter.svelte';
	import MenuList from './MenuList.svelte';
	import PlayingImg from '$lib/Shared/NowPlaying/PlayingImg.svelte';

	import convertTime from '$functions/convertTime';

	import {
		playingEpisodeChapters,
		swiper,
		playerRemainingTime,
		showNotesVerticalSwiper
	} from '$/stores';
</script>

<!-- svelte-ignore a11y-media-has-caption-->
<div class="bottom-controls-container">
	<div
		class="img-container"
		on:click={(e) => {
			$swiper?.slideTo(0);
			$showNotesVerticalSwiper?.slideTo(0);
			$swiper.allowTouchMove = true;
			$showNotesVerticalSwiper.allowTouchMove = false;
		}}
	>
		<PlayingImg controlImg={true} />
	</div>
	<div class="control-buttons">
		{#if $playingEpisodeChapters?.length > 0}
			<PreviousChapter size="36" />
		{/if}
		<RewindButton size="36" />
		<PlayPauseButton size="60" />
		<FastFowardButton size="36" />
		{#if $playingEpisodeChapters?.length > 0}
			<NextChapter size="36" />
		{/if}
	</div>
	<div class="menu-buttons">
		<MenuList size="42" />
	</div>
	<p class="player-time">
		{$playerRemainingTime ? `-${convertTime($playerRemainingTime)}` : ''}
	</p>
</div>

<style>
	.bottom-controls-container {
		width: 100%;
		user-select: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--mobile-bottom-controls-background-color-light);
		background: linear-gradient(
			var(--mobile-bottom-controls-background-color-dark),
			var(--mobile-bottom-controls-background-color-light)
		);

		border-top: var(--mobile-bottom-border);

		position: relative;
	}

	.img-container {
		height: 70px;
		width: 70px;
	}

	.img-container {
		width: 48px;
		height: 48px;
		margin: 2px;
	}

	.control-buttons {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.menu-buttons {
		min-width: 48px;
		display: flex;
		align-items: center;
	}

	.player-time {
		position: absolute;
		text-align: center;
		bottom: 0;
		left: 0;
		padding: 0;
		font-size: 0.8em;
		margin-left: 5px;
	}
</style>
