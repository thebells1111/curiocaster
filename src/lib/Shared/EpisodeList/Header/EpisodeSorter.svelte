<script>
	import { slide } from 'svelte/transition';
	import sortEpisodes from '$functions/sortEpisodes';
	import MoreVert from '$lib/icons/MoreVert.svelte';
	import removeEpisodesFromRecent from '$functions/removeEpisodesFromRecent';

	import {
		selectedPodcast,
		filteredEpisodesList,
		playingList,
		playingPodcast,
		selectedPodcastState,
		podcastStateDB,
		episodeSorter,
		episodesList,
		mainPodcastList,
		podcastDB,
		podcastList,
		showMobile,
		showRecentEpisodes,
		recentEpisodes,
		podcastListPane
	} from '$/stores';

	let selectedSorter = $episodeSorter;
	let completeStatus = false;

	function handleSorterChange(sortType) {
		selectedSorter = $episodeSorter = sortType;
		$selectedPodcastState.episodeSorter = selectedSorter;
		$filteredEpisodesList = sortEpisodes($filteredEpisodesList, selectedSorter);

		podcastStateDB.setItem(`${$selectedPodcast.id}`, $selectedPodcastState);
		if ($selectedPodcast?.id === $playingPodcast.id) {
			$playingList = $filteredEpisodesList; //reloads to clear completed episodes
		}
	}

	$: if ($selectedPodcastState) {
		selectedSorter = $episodeSorter;
		// $filteredEpisodesList = sortEpisodes(
		//   $filteredEpisodesList,
		//   selectedSorter,
		//   { complete: $episodeSorter.completeStatus }
		// );
		// if (
		//   $selectedPodcast?.id === $playingPodcast.id &&
		//   selectedPlayingList === 'episodes'
		// ) {
		//   $playingList = $filteredEpisodesList;
		// }
	}

	let showList = false;

	function handleSettingsClick() {
		showList = !showList;
	}

	function handleUlClick() {
		showList = false;
	}

	function handleWindowClick(e) {
		let fileNode = e.target;
		while (fileNode.id !== 'episodes-sorter-button') {
			fileNode = fileNode.parentElement;
			if (!fileNode || fileNode.tagName === 'HTML') {
				showList = false;
				break;
			}
		}
	}

	function handleCompleteStatusChange(e) {
		let id = $showRecentEpisodes ? 'recent' : $selectedPodcast.id;
		$selectedPodcastState.filterCompletedEpisodes = e.target.checked;
		podcastStateDB.setItem(`${id}`, $selectedPodcastState);
		$filteredEpisodesList = sortEpisodes($episodesList, $episodeSorter, {
			complete: $episodeSorter.completeStatus
		});
	}

	async function deletePodcast() {
		const mainIndex = $mainPodcastList.findIndex(({ id }) => `${id}` === `${$selectedPodcast.id}`);

		const listIndex = $podcastList.findIndex(({ id }) => `${id}` === `${$selectedPodcast.id}`);

		$mainPodcastList.splice(mainIndex, 1);
		$podcastList.splice(listIndex, 1);

		$podcastList = $podcastList;

		podcastDB.removeItem(`${$selectedPodcast.id}`);
		podcastStateDB.removeItem(`${$selectedPodcast.id}`);
		removeEpisodesFromRecent($selectedPodcast.id);
	}

	async function markAllComplete() {
		if (!$showRecentEpisodes) {
			console.log($recentEpisodes);
			let state = (await podcastStateDB.getItem(`${$selectedPodcast.id}`)) || {};

			for (const episode of $selectedPodcast.episodes) {
				let guid = episode.guid;
				state[guid] = state[guid] || {};
				state[guid].complete = true;

				if (
					$recentEpisodes.find((episode) => {
						return guid === episode.guid;
					})
				) {
					let recentState = (await podcastStateDB.getItem(`recent`)) || {};
					recentState[guid] = recentState[guid] || {};
					recentState[guid].complete = true;
					await podcastStateDB.setItem(`recent`, recentState);
				}
			}
			$selectedPodcastState = state;
			await podcastStateDB.setItem(`${$selectedPodcast.id}`, state);

			if ($selectedPodcastState?.filterCompletedEpisodes) {
				$filteredEpisodesList = sortEpisodes($episodesList, $episodeSorter);
			}
		} else {
			console.log($recentEpisodes);
			let recentState = await podcastStateDB.getItem('recent');
			console.log(recentState);
			$selectedPodcastState = recentState;
			if ($selectedPodcastState?.filterCompletedEpisodes) {
				$filteredEpisodesList = sortEpisodes($episodesList, $episodeSorter);
			}

			for (let v of $recentEpisodes) {
				let state = recentState[v.guid] || {};
				state.complete = true;
				recentState[v.guid] = state;
				let newState = await podcastStateDB.getItem(`${v.podcast}`);
				newState = newState || {};
				newState[v.guid] = newState[v.guid] || {};
				newState[v.guid].complete = true;
				await podcastStateDB.setItem(`${v.podcast}`, newState);
			}
			podcastStateDB.setItem('recent', recentState);
		}
	}
</script>

<svelte:window on:click={handleWindowClick} />

<div class="sorter">
	<button
		id="episodes-sorter-button"
		style={$showMobile ? '' : 'background-color:var(--episode-card-color)'}
		on:click={handleSettingsClick}
	>
		<MoreVert size="27px" />
	</button>

	{#if showList}
		<ul
			on:click={handleUlClick}
			transition:slide={{ duration: 200 }}
			style={$showMobile ? '' : 'top: 44px; right: 8px'}
		>
			<li on:click={handleSorterChange.bind(this, 'newest')}>newest first</li>
			<li on:click={handleSorterChange.bind(this, 'oldest')}>oldest first</li>
			{#if $podcastListPane === 'subscriptions'}
				<li on:click={markAllComplete}>mark all as complete</li>
				<li>
					<label class="checkbox">
						<span>filter completed episodes</span>
						<input
							type="checkbox"
							checked={$selectedPodcastState?.filterCompletedEpisodes}
							on:change={handleCompleteStatusChange}
						/>
					</label>
				</li>
				{#if !$showRecentEpisodes}
					<li on:click={deletePodcast}>delete podcast</li>
				{/if}
			{/if}
		</ul>
	{/if}
</div>

<style>
	div {
		margin: 0;
	}
	ul {
		background-color: var(--secondary-color);
		color: var(--secondary-text-color);
		border-radius: 3px;
		width: 215px;
		padding: 0;
		margin: 0;
		text-align: right;
		display: initial;
		position: absolute;
		top: 40px;
		right: 4px;
		overflow: hidden;
		box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
		z-index: 3;
	}

	li {
		list-style: none;
		cursor: pointer;
		height: 42px;
		padding: 0 4px;
		line-height: 42px;
	}
	li:hover {
		background-color: var(--tertiary-color);
		color: var(--tertiary-text-color);
	}

	button {
		background-color: transparent;
		margin: 0 8px;
		color: var(--primary-text-color);
		border: none;
		border-radius: 40px;
		width: 40px;
		height: 40px;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.checkbox {
		display: inline-flex;
		cursor: pointer;
		position: relative;
		height: 100%;
		width: 100%;
		align-items: center;
		justify-content: flex-end;
	}

	.checkbox > span {
		padding-right: 0.25em;
	}

	.checkbox > input {
		height: 15px;
		width: 15px;
		-webkit-appearance: none;
		-moz-appearance: none;
		-o-appearance: none;
		appearance: none;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		outline: none;
		background-color: transparent;
		cursor: pointer;
		margin: 0;
		color: var(--primary-text-color);
	}

	.checkbox:hover > input {
		color: var(--tertiary-text-color);
	}

	.checkbox > span + input:checked::before {
		content: '\2713';
		display: block;
		text-align: center;
		position: absolute;
		right: -2px;
		bottom: 0.45em;
		font-size: 1.4em;
		font-weight: 700;
	}
</style>
