<script>
	import Subscribe from '$lib/Shared/EpisodeList/Header/Subscribe.svelte';
	import EpisodeSorter from '$lib/Shared/EpisodeList/Header/EpisodeSorter.svelte';

	import Mic from '$lib/icons/Mic.svelte';

	import {
		selectedPodcast,
		playingPodcast,
		episodesList,
		filteredEpisodesList,
		playingList,
		mainPodcastList,
		filteringEpisodes,
		liveEpisodes,
		pendingEpisodes,
		pendingEpisodesSwiper,
		showRecentEpisodes
	} from '$/stores';

	import Image from '$functions/Image.svelte';

	let filterText = '';

	function handleFilterTextInput() {
		$filteringEpisodes = true;
		$filteredEpisodesList = $episodesList.filter(
			(episode) =>
				episode.title.toLowerCase().includes(filterText.toLowerCase()) ||
				episode.description.toLowerCase().includes(filterText.toLowerCase())
		);
		if ($selectedPodcast?.id === $playingPodcast.id) {
			$playingList = $filteredEpisodesList;
		}
	}

	function handleFilterTextSelect() {
		filterText = '';
		$filteringEpisodes = true;
		$filteredEpisodesList = $episodesList;
		if ($selectedPodcast?.id === $playingPodcast.id) {
			$playingList = $filteredEpisodesList;
		}
	}

	function handleFilterClear() {
		$filteringEpisodes = false;
		if ($filteredEpisodesList.length === 0) {
			filterText = '';
			$filteredEpisodesList = $episodesList;
			if ($selectedPodcast?.id === $playingPodcast.id) {
				$playingList = $filteredEpisodesList;
			}
		}
	}

	let titleHeight;
	export let headerHeight;
</script>

<header bind:clientHeight={headerHeight}>
	<div class="top-bar">
		<div class="logo">
			{#if $showRecentEpisodes}
				<Image
					src={'https://curiocaster.com/CurioLogo192.png'}
					alt={'CurioCaster Logo'}
					style={`width: 80px; height: 80px;	border-radius: 5px;`}
				/>
			{:else if $selectedPodcast}
				<Image
					src={$selectedPodcast.artwork}
					alt={$selectedPodcast.title}
					style={`width: 80px; height: 80px;	border-radius: 5px;`}
				/>
			{/if}
		</div>

		<div class="title">
			<div bind:clientHeight={titleHeight}>
				<h1>{$showRecentEpisodes ? 'Recent Episodes' : $selectedPodcast?.title}</h1>
			</div>
		</div>
	</div>

	<div class="filter-box" class:long-title={titleHeight > 32}>
		{#if $mainPodcastList.findIndex(({ id }) => id === $selectedPodcast?.id || $showRecentEpisodes) > -1}
			<input
				type="text"
				bind:value={filterText}
				placeholder="search episodes"
				on:input={handleFilterTextInput}
				on:focus={handleFilterTextSelect}
				on:blur={handleFilterClear}
			/>
			<EpisodeSorter />
		{:else}
			<div class="subscribe"><Subscribe /></div>
		{/if}
	</div>
</header>

{#if ($liveEpisodes?.length > 0 || $pendingEpisodes?.length > 0) && !$showRecentEpisodes}
	<div class="on-air">
		<button
			class:live={$liveEpisodes?.length > 0}
			on:click={() => {
				if ($pendingEpisodes?.length > 0) {
					$pendingEpisodesSwiper.slideTo(1, 1000);
				}
			}}
		>
			{#if $liveEpisodes?.length > 0}
				<span><Mic size="24px" />On Air</span>
			{:else if $pendingEpisodes?.length > 0}
				<span class="programs">Scheduled <br /> Programs</span>
			{/if}
		</button>
	</div>
{/if}

<style>
	header {
		position: relative;
		background-color: red;
		background: linear-gradient(var(--quadary-color), var(--primary-color));
	}

	.top-bar {
		display: flex;
		margin-bottom: 4px;
	}

	.logo {
		width: 80px;
		height: 80px;
		display: inline-block;
		margin: 4px 0 0 4px;
	}

	.title {
		width: 100%;
		margin-left: 4px;
		position: relative;
	}

	.filter-box {
		position: absolute;
		width: calc(100% - 84px);
		right: 0px;
		bottom: 4px;
		display: flex;
		align-items: center;
	}

	.long-title {
		position: relative;
		width: 100%;
		bottom: 0px;
	}

	input {
		height: 30px;
		width: 100%;
		outline: none;
		text-align: center;
		margin: 0 0 0 8px;
		background-color: var(--input-background-color);
		color: var(--secondary-text-color);
		border-radius: 20px;
	}

	.subscribe {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		margin: 0 8px;
	}

	h1 {
		margin: 0;
		display: inline;
	}

	.on-air {
		display: flex;
		align-items: center;
		color: var(--primary-text-color);
		width: 100%;
	}

	.on-air button {
		width: 90px;
		height: 32px;
		margin: 4px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		color: var(--tertiary-text-color);
		border-radius: 16px;
	}

	button.live {
		color: hsl(0, 100%, 25%);
		outline: none;
		border-color: hsl(0, 100%, 25%);
		box-shadow: 0 0 9px hsl(0deg 100% 50% / 60%), inset 0 0 7px hsl(0deg 100% 50% / 40%),
			0 2px 0 #000;
		border-radius: 0;
	}

	button span {
		display: flex;
		align-items: center;
	}

	.programs {
		font-size: 0.8em;
		line-height: 1em;
	}
</style>
