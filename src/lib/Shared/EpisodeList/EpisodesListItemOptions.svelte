<script>
	import { fly } from 'svelte/transition';
	import sortEpisodes from '$functions/sortEpisodes';
	import MoreVert from '$lib/icons/MoreVert.svelte';

	import {
		selectedPodcast,
		userState,
		selectedEpisode,
		showMobile,
		userStateDB,
		podcastDB,
		podcastStateDB,
		recentEpisodes,
		selectedPodcastState,
		filteredEpisodesList,
		episodesList,
		episodeSorter,
		showRecentEpisodes
	} from '$/stores';

	export let episode;

	let showList = false;
	export let isDownloading = false;

	function handleSettingsClick() {
		showList = !showList;
	}

	function handleUlClick() {
		showList = false;
	}

	function handleWindowClick(e) {
		let fileNode = e.target;
		while (fileNode.id !== `episode-list-option-button-${episode.id}`) {
			fileNode = fileNode.parentElement;
			if (!fileNode || fileNode.tagName === 'HTML') {
				showList = false;
				break;
			}
		}
	}

	async function addToQueue(episode) {
		handleSettingsClick();
		$userState.playlist = $userState.playlist || [];

		episode = { ...episode };
		if (!episode.podcast) {
			episode.podcast = {
				id: $selectedPodcast.id,
				title: $selectedPodcast.title,
				artwork: $selectedPodcast.artwork,
				value: $selectedPodcast.value
			};
		} else {
			let podcast = await podcastDB.getItem(`${episode.podcast}`);
			episode.podcast = {
				id: podcast.id,
				title: podcast.title,
				artwork: podcast.artwork,
				value: podcast.value
			};
		}
		$userState.playlist.push(episode);
		$userState = $userState;
		userStateDB.setItem('userState', $userState);
	}

	async function markComplete(episode) {
		handleSettingsClick();

		let id = episode.podcast ? episode.podcast : $selectedPodcast.id;
		let state = (await podcastStateDB.getItem(`${id}`)) || {};
		let recentState = [];
		state[episode.guid] = state[episode.guid] || {};
		state[episode.guid].complete = true;
		podcastStateDB.setItem(`${id}`, state);

		if ($recentEpisodes.find(({ guid }) => guid === episode.guid)) {
			recentState = (await podcastStateDB.getItem(`recent`)) || {};
			recentState[episode.guid] = recentState[episode.guid] || {};
			recentState[episode.guid].complete = true;
			podcastStateDB.setItem(`recent`, recentState);
		}

		$selectedPodcastState = $showRecentEpisodes ? recentState : state;
		if ($selectedPodcastState.filterCompletedEpisodes) {
			$filteredEpisodesList = sortEpisodes($episodesList, $episodeSorter);
		}
	}
</script>

<svelte:window on:click={handleWindowClick} />

<div class="episode-list-options">
	<button
		class:selected={episode === $selectedEpisode}
		id={`episode-list-option-button-${episode?.id || ''}`}
		on:click|stopPropagation={handleSettingsClick}
		class:mobile={$showMobile}
	>
		<MoreVert size="27px" />
	</button>
	{#if showList}
		<ul
			on:click={handleUlClick}
			transition:fly={{ y: $showMobile ? 50 : -50, duration: 200 }}
			style={$showMobile ? 'right:4px' : 'right:12px'}
		>
			<li on:click|stopPropagation={addToQueue.bind(this, episode)}>Add To Queue</li>
			<li on:click|stopPropagation={markComplete.bind(this, episode)}>Mark Complete</li>
		</ul>
	{/if}
</div>

<style>
	ul {
		background-color: var(--secondary-color);
		color: var(--secondary-text-color);
		border-radius: 3px;
		width: 200px;
		padding: 0;
		margin: 0;
		text-align: right;
		display: initial;
		position: absolute;
		top: 50px;
		right: 12px;
		overflow: hidden;
		box-shadow: var(--dropdown-box-shadow);
		z-index: 3;
		-webkit-user-select: none; /* Safari */
		user-select: none; /* Standard syntax */
	}

	li {
		list-style: none;
		cursor: pointer;
		height: 42px;
		padding: 0 8px;
		line-height: 42px;
	}
	li:hover {
		background-color: var(--tertiary-color);
		color: var(--tertiary-text-color);
	}

	button {
		color: var(--secondary-text-color);
		margin: 8px 8px 8px 16px;
		background-color: transparent;
		border: none;
		height: 36px;
		width: 36px;
		/* border: 1px solid var(--border-color); */
		border-radius: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	button.selected {
		background-color: transparent;
	}

	button.mobile {
		margin: 0;
	}

	button:active,
	button:hover {
		transform: scale(1.2);
		transition-duration: 0.2s;
	}
</style>
