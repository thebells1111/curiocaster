<script>
	import savePlayingPodcastState from '$functions/savePlayingPodcastState';
	import stripHtml from 'striptags';

	import Image from '$functions/Image.svelte';

	import PlayArrow from '$lib/icons/PlayArrow.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	import Loading from '$lib/icons/LoadingRotate.svelte';
	import Downloading from '$lib/icons/Downloading.svelte';

	import EpisodeListItemOptions from '../../../../Shared/EpisodeList/EpisodesListItemOptions.svelte';

	import prettyDate from '$functions/prettyDate';

	import loadEpisode from '$functions/loadEpisode';

	import {
		selectedPodcast,
		selectedEpisode,
		showNotesPane,
		rightPane,
		playingPodcast,
		playingList,
		selectedPlayingList,
		playingEpisode,
		player,
		playerIsPaused,
		filteredEpisodesList,
		showMobile,
		currentEpisodeData,
		showSubscriptionShowNotes,
		currentDesktopView,
		liveLoading,
		newestEpisodes,
		remoteServer,
		feedTitle,
		showRecentEpisodes
	} from '$/stores';

	export let episode;
	export let fromSubscriptions = false;
	let hidePlayButton = true;
	let isDownloading = false;

	async function selectEpisode(episode) {
		$feedTitle = episode?.feedTitle || 'Recent Episodes';
		let shortDescription = episode.description;
		episode.description = '';
		fetch(
			`${remoteServer}api/queryindex?q=episodes/byid?` +
				encodeURIComponent(`id=${episode.id}` + '&fulltext')
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				$feedTitle = data?.episode?.feedTitle;
				if (data?.episode?.description) {
					$selectedEpisode.description = data?.episode?.description;
				} else {
					$selectedEpisode.description = shortDescription;
				}
			});
		let id = episode.podcast || $selectedPodcast.id;
		$newestEpisodes?.[id]?.delete(episode.guid);
		$newestEpisodes = $newestEpisodes;

		if (!fromSubscriptions) {
			if (episode.guid === $selectedEpisode?.guid) {
				$showSubscriptionShowNotes = !$showSubscriptionShowNotes;
			} else {
				$showSubscriptionShowNotes = true;
			}
		} else {
			$currentEpisodeData = 'showNotes';
		}

		if ($showRecentEpisodes) {
			$showSubscriptionShowNotes = false;
		}

		if ($showNotesPane) {
			$showNotesPane.scrollTop = 0;
		}
		$selectedEpisode = episode;
	}

	function handlePlayButton() {
		if (!$playerIsPaused) {
			$playerIsPaused = true;
		}
		if ($player && $player.paused) {
			$player.play();
			$playerIsPaused = false;
		} else if ($player) {
			$player.pause();
		}
	}

	async function startEpisode(episode) {
		console.log(episode);
		if ($showMobile) {
			selectEpisode(episode, { panel: 0 });
		}

		$selectedPlayingList = 'episodes';
		$playingList = $filteredEpisodesList;

		if (
			$playingPodcast?.title === $selectedPodcast?.title &&
			$playingEpisode?.title === episode?.title
		) {
			handlePlayButton();
		} else {
			loadEpisode(episode, $selectedPodcast, 'episodes');
			$currentDesktopView = 'nowPlaying';
		}
	}

	function isNewEpisode(episode) {
		let id = episode?.podcast || $selectedPodcast?.id;

		if (id) {
			return $newestEpisodes[id]?.has(episode.guid);
		}
	}

	function secondsToHms(d) {
		d = Number(d);
		const h = Math.floor(d / 3600);
		const m = Math.floor((d % 3600) / 60);
		const s = Math.floor((d % 3600) % 60);

		const hDisplay = h > 0 ? `${h}hr ` : '';
		const mDisplay = m < 10 ? `0${m}min ` : `${m}min `;
		const sDisplay = s < 10 ? `0${s}sec` : `${s}sec`;
		return hDisplay + mDisplay + sDisplay;
	}
</script>

<div class="container" on:dblclick={startEpisode.bind(this, episode)}>
	<div
		class="card"
		class:selected={episode === $selectedEpisode}
		on:mouseenter={() => {
			hidePlayButton = false;
		}}
		on:mouseleave={() => {
			hidePlayButton = true;
		}}
	>
		<Image
			src={episode?.image || $selectedPodcast?.artwork}
			style={'margin:8px; border-radius:6px; width:130px; height: 130px; object-fit: contain;'}
		/>

		{#if $liveLoading && $playingEpisode.id === episode.id}
			<div class="loading-icon">
				<Loading size="80px" color={'var(--primary-text-color)'} />
			</div>
		{:else}
			<button
				class="play-episode-button  episode-button"
				class:hide={hidePlayButton}
				on:click={startEpisode.bind(this, episode)}
				aria-label="Play Episode"
			>
				{#if $playingPodcast?.title === $selectedPodcast?.title && $playingEpisode?.title === episode?.title && !$playerIsPaused}
					<Pause size="80px" />
				{:else}
					<PlayArrow size="80px" />
				{/if}
			</button>
		{/if}
		{#if episode?.liveStatus === 'live'}
			<div class="new-episode live">LIVE</div>
		{:else if isNewEpisode(episode) && $newestEpisodes}
			<div class="new-episode ">NEW</div>
		{/if}
		{#if isDownloading}
			<div class="downloading">
				<Downloading size="32" />
			</div>
		{/if}
		<div on:click={selectEpisode.bind(this, episode, { panel: 3 })} class="description">
			<div class="head">
				<div class="head-top">
					{#if episode?.datePublished}
						<p>{prettyDate(episode?.datePublished)}</p>
					{/if}
					{#if episode?.duration}
						<p>{secondsToHms(episode?.duration)}</p>
					{/if}
				</div>
				<h1>{`${$showRecentEpisodes ? episode.feedTitle + ' - ' : ''}${episode?.title}`}</h1>

				<div class="options-container">
					{#if episode?.liveStatus !== 'live'}
						<EpisodeListItemOptions {episode} bind:isDownloading />
					{/if}
				</div>
			</div>
			<div class="slug">
				<p>{typeof episode?.description === 'string' ? stripHtml(episode?.description) : ''}</p>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 0 8px 8px 8px;
		list-style: none;
		cursor: pointer;
		box-sizing: border-box;
		display: flex;
		position: relative;
		overflow: hidden;
	}

	.card {
		height: 100%;
		width: 100%;
		margin: 0;
		list-style: none;
		cursor: pointer;
		box-sizing: border-box;
		display: flex;
		overflow: hidden;
		background-color: var(--episode-card-color);
		border-radius: 8px;
		color: #333;
	}

	.card.selected {
		background-color: var(--episode-card-selected);
		color: var(--primary-color);
	}
	.card:hover {
		background-color: var(--episode-card-hover);
	}

	.description {
		width: 100%;
	}

	.options-container {
		position: absolute;
		top: -4px;
		right: -8px;
		display: flex;
		align-items: center;
	}

	.head {
		width: 100%;
	}

	.head h1 {
		width: calc(100% - 32px);
		margin: 2px 0 2px 0;
		font-size: 1.17em;
		font-weight: 650;
		max-height: 48px;
		overflow: hidden;
		text-align: start;
		display: inline-block;
		line-height: 1.17em;
	}

	.head-top {
		display: flex;
	}

	.head-top p {
		font-size: 0.8em;
		margin: 0 32px 0 0;
		padding: 0;
	}
	.new-episode {
		margin: 0;
		padding: 2px 30px;
		text-align: end;
		position: absolute;
		top: 10px;
		left: -25px;
		color: var(--secondary-text-color);
		background-color: var(--new-episode-color);
		transform: rotateY(0deg) rotate(-45deg);
		filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
	}

	.live {
		background-color: var(--live-episode-color);
		font-weight: 700;
	}

	.episode-button {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 42px;
		margin: 0;
		transform: scale(1);
		transition-duration: 0.2s;
	}

	.play-episode-button {
		background-color: hsla(0, 0%, 0%, 33%);
		position: absolute;
		width: 130px;
		height: 130px;
		margin: 8px;
		filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
		color: hsla(0, 0%, 100%, 80%);
		border-radius: 6px;
	}

	.loading-icon {
		background-color: hsla(0, 0%, 0%, 33%);
		position: absolute;
		width: 130px;
		height: 130px;
		margin: 8px;
		filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
		color: hsla(0, 0%, 100%, 80%);
		border-radius: 6px;
		display: grid;
		place-content: center;
	}

	.slug {
		height: 64px;
		overflow: hidden;
		padding-right: 8px;
	}

	.downloading {
		color: var(--primary-text-color);
		animation: blink-animation 2s steps(5, start) infinite;
		position: absolute;
		bottom: 18px;
		left: 112px;
		background-color: var(--episode-card-color);
		display: grid;
		place-content: center;
		border-radius: 30px;
		filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
	}

	.hide {
		display: none;
	}

	@keyframes blink-animation {
		to {
			visibility: hidden;
		}
	}
</style>
