<script>
	import stripHtml from 'striptags';

	import Image from '$functions/Image.svelte';

	import PlayArrow from '$lib/icons/PlayArrow.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	import Loading from '$lib/icons/LoadingRotate.svelte';
	import EpisodeListItemOptions from '../../../Shared/EpisodeList/EpisodesListItemOptions.svelte';
	import Downloading from '$lib/icons/Downloading.svelte';

	import loadEpisode from '$functions/loadEpisode';

	import prettyDate from '$functions/prettyDate';

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
		swiper,
		filteredEpisodesList,
		showMobile,
		showNotesVerticalSwiper,
		currentEpisodeData,
		showSubscriptionShowNotes,
		liveLoading,
		newestEpisodes,
		showRecentEpisodes,
		remoteServer
	} from '$/stores';

	export let episode;
	export let fromSubscriptions = false;

	async function selectEpisode(episode, slide) {
		let shortDescription = episode.description;
		episode.description = '';
		fetch(
			`${remoteServer}api/queryindex?q=episodes/byid?` +
				encodeURIComponent(`id=${episode.id}` + '&fulltext')
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
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
			if (episode.guid === $selectedEpisode.guid || $showRecentEpisodes) {
				$showSubscriptionShowNotes = !$showSubscriptionShowNotes;
			} else {
				$showSubscriptionShowNotes = true;
			}
		} else {
			$currentEpisodeData = 'showNotes';
		}

		if ($showNotesPane) {
			$showNotesPane.scrollTop = 0;
		}
		$selectedEpisode = episode;

		if ($swiper) {
			if (slide.panel === 0) {
				$swiper?.slideTo(0);
				$showNotesVerticalSwiper?.slideTo(0);
				$swiper.allowTouchMove = true;
				$showNotesVerticalSwiper.allowTouchMove = false;
			} else {
				$showNotesVerticalSwiper?.slideTo(1);
			}
		}
	}

	async function startEpisode(episode) {
		let id = episode.guid;
		if ($showMobile) {
			selectEpisode(episode, { panel: 0 });
		}
		$playingList = $playingPodcast?.episodes;
		$selectedPlayingList = 'episodes';
		$playingList = $filteredEpisodesList;

		if (
			$playingPodcast?.title === $selectedPodcast?.title &&
			$playingEpisode?.title === episode?.title
		) {
			if (!$playerIsPaused) {
				$player.pause();
			} else {
				$player.play();
			}
			$playerIsPaused = $player.paused;
		} else {
			loadEpisode(episode, $selectedPodcast, 'episodes');
			if (!$showMobile) {
				// $middlePane = 'nowPlaying';
			}
		}
	}

	function makeSnippet(string) {
		if (typeof string === 'string') {
			let s = stripTags(decode(addAmpersand(addQuotes(string)))).substring(0, 110);

			s = s.substring(0, s.lastIndexOf(' '));

			return s.length > 0 ? `${s} ...` : '';
		}
		return '';

		function decode(str) {
			return str.replace(/&#(\d+);/g, function (match, dec) {
				return String.fromCharCode(dec);
			});
		}
		function stripTags(str) {
			return str.replace(/(<([^>]+)>)/gi, '');
		}
		function addAmpersand(str) {
			return str.replace(/&amp;/g, '&');
		}
		function addQuotes(str) {
			return str.replace(/&quot;/g, '"');
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
		on:click={selectEpisode.bind(this, episode, { panel: 3 })}
	>
		{#if episode?.liveStatus === 'live'}
			<div class="new-episode live">LIVE</div>
		{:else if isNewEpisode(episode) && $newestEpisodes}
			<div class="new-episode ">NEW</div>
		{/if}

		<div class="description">
			<div class="head">
				<Image
					src={episode?.image || $selectedPodcast?.artwork}
					style={'border-radius:6px; width:60px; height: 60px; object-fit: contain; float:left; margin-right: 8px'}
				/>
				<p class:hide={episode?.liveStatus === 'live'}>{prettyDate(episode?.datePublished)}</p>
				<h1>{`${$showRecentEpisodes ? episode.feedTitle + ' - ' : ''}${episode?.title}`}</h1>

				<p class="slug">{makeSnippet(stripHtml(episode?.description))}</p>
			</div>

			<div class="bottom-control-bar">
				{#if $liveLoading && $playingEpisode.id === episode.id}
					<div class="loading-icon">
						<Loading size="40px" color={'var(--primary-text-color)'} />
					</div>
				{:else}
					<button
						class="play-episode-button  episode-button"
						on:click|stopPropagation={startEpisode.bind(this, episode)}
						aria-label="Play Episode"
					>
						{#if $playingPodcast?.title === $selectedPodcast?.title && $playingEpisode?.title === episode?.title && !$playerIsPaused}
							<Pause size="40px" />
						{:else}
							<PlayArrow size="40px" />
						{/if}
					</button>
				{/if}
				<div class="options-container">
					{#if episode?.liveStatus !== 'live'}
						<EpisodeListItemOptions {episode} />
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		height: 100%;
		margin: 0;
		padding: 4px 8px;
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
		padding: 4px;
		list-style: none;
		cursor: pointer;
		box-sizing: border-box;
		display: flex;
		position: relative;
		overflow: hidden;
		background-color: var(--episode-card-color);
		border-radius: 8px;
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
		display: flex;
		flex-direction: column;
	}

	.head {
		width: 100%;
		flex-grow: 1;
	}

	.head h1 {
		width: calc(100% - 100px);
		margin: 0;
		font-size: 1.17em;
		font-weight: 650;
		max-height: 2.34em;
		overflow: hidden;
		text-align: start;
		display: inline-block;
		line-height: 1.17em;
	}

	.head p {
		padding: 0;
		font-size: 0.8em;
		margin: 0 8px;
	}

	.head .slug {
		max-height: 5.25em;
		padding: 0;
		font-size: 1em;
		margin: 0;
	}

	.new-episode {
		margin: 0;
		padding: 2px 30px;
		text-align: end;
		position: absolute;
		top: 10px;
		right: -25px;
		color: var(--secondary-text-color);
		background-color: var(--new-episode-color);
		transform: rotateY(0deg) rotate(45deg);
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

	.play-episode-button,
	.loading-icon {
		filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
		color: var(--primary-text-color);
	}

	.bottom-control-bar {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.options-container {
		margin: 0 8px 8px 0;
	}

	.hide {
		visibility: hidden;
	}
</style>
