<script>
	import ImageLoader from '$lib/Shared/ImageLoader.svelte';
	import SubscriptionContextMenu from '../PodcastList/SubscriptionContextMenu.svelte';
	import PodcastSearch from '$lib/Shared/PodcastSearch/PodcastSearch.svelte';
	import Search from '$lib/icons/Search.svelte';
	import FilterPodcasts from '../PodcastList/FilterPodcasts.svelte';
	import getRSS from '$functions/getRSSFeed';
	import Loading from '$lib/icons/LoadingRotate.svelte';
	import sortEpisodes from '$functions/sortEpisodes';

	import {
		musicList,
		selectedPodcast,
		podcastStateDB,
		selectedPodcastState,
		episodesList,
		filteredEpisodesList,
		selectedEpisode,
		displayShowNotesPane,
		rightPane,
		showMobile,
		showFeatured,
		listSwiper,
		liveEpisodes,
		showPodcastFilter,
		recentEpisodes,
		showRecentEpisodes,
		newEpisodesFlag,
		showSubscriptionShowNotes,
		isUpdatingEpisodes,
		episodeSorter,
		feedTitle,
		feedItems,
		remoteServer
	} from '$/stores';

	let podcastBindings = [];

	async function getPodcast(podcast) {
		$feedTitle = 'Recent Episodes';
		$showRecentEpisodes = false;
		$liveEpisodes = [];
		history.replaceState(null, null, window.location.origin + `/podcast/pi${podcast.id}`);
		$rightPane = 'showNotes';
		// $currentList = 'episodesList';

		$showFeatured = false;
		console.log(podcast);

		$selectedPodcast = podcast;
		$selectedPodcastState = (await podcastStateDB.getItem(`${podcast.id}`)) || {};
		$episodeSorter = $selectedPodcastState.episodeSorter || 'newest';

		if (!podcast.episodes) {
			let res = await fetch(
				`${remoteServer}api/queryindex?q=episodes/byfeedid?` +
					encodeURIComponent(`id=${podcast.id}` + '&fulltext')
			);
			let data = await res.json();
			podcast.episodes = data.items;
		}
		$episodesList = podcast.episodes;
		$filteredEpisodesList = sortEpisodes($episodesList, $episodeSorter);
		$selectedEpisode = $filteredEpisodesList[0];

		$displayShowNotesPane = true;

		if ($showMobile) {
			$listSwiper.slideTo(1);
		}

		getRSS(podcast.url);
		console.log($feedItems);
	}

	let isSearchFocused = false;

	$: console.log($musicList);
</script>

<ul>
	{#each $musicList as podcast, index}
		<li
			data-id={podcast.id}
			data-_id={podcast._id}
			data-index={index}
			data-type="podcastList"
			bind:this={podcastBindings[index]}
			class="podcast-title"
			class:selected={podcast.id === $selectedPodcast?.id && !$showRecentEpisodes}
			on:click={getPodcast.bind(null, podcast)}
		>
			<ImageLoader
				url={podcast?.artwork || podcast?.image}
				alt={`${podcast?.title} Logo`}
				title={podcast?.title}
				imageSize="50"
				styling="border-radius: 2px; 
    margin-right: 6px; min-width: 50px"
			/>
			<div
				class="title"
				class:selected={podcast.id === $selectedPodcast?.id && !$showRecentEpisodes}
			>
				{podcast?.title}
			</div>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
		margin: 0;
		height: 100%;
		overflow: auto;
		user-select: none;
	}

	li {
		list-style-type: none;
		position: relative;
	}

	.podcast-title {
		display: flex;
		align-items: center;
		overflow: hidden;
		width: calc(100% - 8px);
		padding: 4px;
		margin: 0;
		border: none;
		text-align: left;
		cursor: pointer;
		height: auto;
		color: var(--primary-text-color);
		background-color: var(--episode-card-color);
		margin: 4px;
		border-radius: 4px;
	}
	.podcast-title.selected {
		background-color: var(--selected-primary-color);
		background: linear-gradient(
			-90deg,
			var(--selected-primary-color) 0%,
			var(--selected-secondary-color) 100%
		);
	}

	.podcast-title:hover {
		background-color: var(--hover-primary-color);
		background: linear-gradient(
			-90deg,
			var(--hover-primary-color) 0%,
			var(--hover-secondary-color) 100%
		);
	}

	.title {
		width: 100%;
	}

	.count-container {
		padding-left: 8px;
	}

	.count-container > .count {
		display: inline-flex;
		color: var(--tertiary-color);
		background-color: var(--primary-accent-color);
		height: 0.75em;
		width: 0.75em;
		align-items: center;
		justify-content: center;
		border-radius: 4em;
		overflow: hidden;
		position: relative;
		right: 6px;
	}

	.search {
		margin: 4px 8px;
		height: 30px;
		background-color: transparent;
		border-radius: 30px;
		border: 1px solid var(--border-color);
		display: flex;
		align-items: center;
		padding: 0;
		position: relative;
	}

	.search-icon {
		color: var(--primary-text-color);
		position: absolute;
		right: 2px;
		top: 1px;
	}

	.hide {
		opacity: 0;
	}
	.loading-icon {
		position: absolute;
		right: 0px;
		top: 14px;
	}
</style>
