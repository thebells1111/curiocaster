<script>
	import NowPlaying from '$lib/Shared/NowPlaying/NowPlaying.svelte';
	import Share from '$lib/Shared/NowPlaying/ControlButtons/Share.svelte';
	import Wallet from '$lib/Shared/NowPlaying/ControlButtons/Wallet.svelte';
	import Chapters from '../Chapters/Chapters.svelte';

	import {
		playingEpisode,
		showMobileChapters,
		swiper,
		goFullscreen,
		selectedEpisode,
		showMobileChat,
		liveEpisodes
	} from '$/stores';

	let showSettings = false;

	function handleShowChapters() {
		$showMobileChapters = !$showMobileChapters;
		showSettings = false;
		$swiper.allowSlideNext = !$showMobileChapters;
		$swiper.allowSlidePrev = !$showMobileChapters;
	}

	function clearSidePanels() {
		showSettings = false;
		$showMobileChapters = false;
		$swiper.allowSlideNext = true;
		$swiper.allowSlidePrev = true;
	}
</script>

<div class="fullscreen-container">
	{#if !$goFullscreen}
		<div class="top-bar">
			<div class="wallet">
				<Wallet />
			</div>
			<div class="share">
				{#if $playingEpisode && $playingEpisode.enclosureUrl}
					<Share />
				{:else}
					<p />
				{/if}
			</div>
			{#if $liveEpisodes?.length}
				<button
					class="chat"
					class:show={$playingEpisode?.chat}
					on:click={() => {
						$showMobileChat = true;
					}}
				>
					Chat
				</button>
			{:else}
				<button
					class="chapters"
					class:show={$playingEpisode?.chaptersUrl}
					on:click={handleShowChapters}
					aria-label="Chapters">Chapters</button
				>
			{/if}
		</div>
	{/if}
	<div class:blur={$showMobileChapters} class:fullscreen={$goFullscreen} class="blur-container">
		<div class="graphics">
			<NowPlaying />
		</div>
	</div>
</div>

<div
	class="cd-panel cd-panel--from-right js-cd-panel-main"
	class:chapters-panel--is-visible={$showMobileChapters}
	on:click={clearSidePanels}
>
	<div class="chapters-panel__container">
		<div class="chapters-container">
			<Chapters bind:showChapters={$showMobileChapters} />
		</div>
	</div>
</div>

<style>
	button,
	button:active {
		background-color: transparent;
		border: none;
		padding: 10px 8px 0 8px;
		margin: 0;
		font-weight: 700;
		align-self: flex-start;
	}

	.blur {
		filter: blur(8px);
		-webkit-filter: blur(8px);
		transition: filter 0.3s;
	}
	.blur-container {
		transition: filter 0.3s;
		height: calc(100vh - 110px);
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.fullscreen {
		position: initial;
	}
	.fullscreen-container {
		width: 100%;
		height: 100%;
		overflow: auto;
		z-index: 3;
		top: 0;
		display: flex;
		flex-direction: column;
	}
	.graphics {
		flex-grow: 1;
		overflow: hidden;
	}

	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 45px;
		color: var(--primary-text-color);
	}

	.wallet {
		width: 86px;
		padding-left: 8px;
		color: var(--primary-text-color);
	}

	p {
		text-align: center;
		padding: 0;
		padding-left: 8px;
	}

	.cd-panel {
		/*...*/
		visibility: hidden;
		transition: visibility 0.36s;
		z-index: 5;
	}

	.cd-panel.chapters-panel--is-visible {
		visibility: visible;
		transition: visibility 0s 0s;
	}

	.cd-panel.settings-panel--is-visible {
		visibility: visible;
		transition: visibility 0s 0s;
	}

	.settings-panel__container {
		/*...*/
		position: fixed;
		width: 100%;
		height: calc(100% - 29px);
		top: 29px;
		transition: transform 0.1s 0.1s;
		z-index: 5;
	}

	.settings-container {
		background-color: #fff;
		overflow: auto;
		float: left;
		border-radius: 5px;
		box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
	}

	.settings-container > li {
		padding: 8px;
		height: 40px;
		font-size: 1.2em;
		font-weight: 600;
	}

	.cd-panel--from-left .settings-panel__container {
		left: 0;
		transform: translate3d(-100%, 0, 0);
	}

	.settings-panel--is-visible .settings-panel__container {
		transform: translate3d(0, 0, 0);
		transition-delay: 0s;
	}

	.chapters,
	.chat {
		color: var(--primary-text-color);
		visibility: hidden;
		width: 86px;
		text-align: right;
	}

	.show {
		visibility: initial;
	}

	.chapters-panel__container {
		/*...*/
		position: fixed;
		width: 100%;
		height: calc(100vh - 29px);
		top: 29px;
		transition: transform 0.1s 0.1s;
		z-index: 5;
	}

	.cd-panel--from-right .chapters-panel__container {
		right: 0;
		transform: translate3d(100%, 0, 0);
	}

	.chapters-panel--is-visible .chapters-panel__container {
		transform: translate3d(0, 0, 0);
		transition-delay: 0s;
	}

	.chapters-container {
		height: calc(100% - 70px);
		background-color: var(--primary-color);
		overflow-x: hidden;
		width: 80%;
		float: right;
		border-radius: 5px;
		box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
		color: var(--primary-text-color);
	}
</style>
