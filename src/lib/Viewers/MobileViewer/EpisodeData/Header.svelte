<script>
	import PlayArrow from '$lib/icons/PlayArrow.svelte';
	import Pause from '$lib/icons/Pause.svelte';
	import Image from '$functions/Image.svelte';

	import savePlayingPodcastState from '$functions/savePlayingPodcastState';
	import loadEpisode from '$functions/loadEpisode';

	import {
		selectedPodcast,
		selectedEpisode,
		selectedPlayingList,
		playingEpisode,
		playingPodcast,
		playerIsPaused,
		player,
		showMobile,
		middlePane,
		swiper,
		showNotesVerticalSwiper
	} from '$/stores';

	async function startEpisode() {
		let podcast = $selectedPodcast;

		if ($selectedPlayingList === 'playlist') {
			podcast = $selectedEpisode.podcast;
		}

		if (
			$playingPodcast.title === podcast.title &&
			$playingEpisode.title === $selectedEpisode.title
		) {
			if ($player.paused) {
				$player.play();
			} else {
				$player.pause();
				savePlayingPodcastState();
			}
			$playerIsPaused = $player.paused;
		} else {
			loadEpisode($selectedEpisode, podcast, $selectedPlayingList);
			if ($showMobile) {
				$swiper?.slideTo(0);
				$showNotesVerticalSwiper?.slideTo(0);
				$swiper.allowTouchMove = true;
				$showNotesVerticalSwiper.allowTouchMove = false;
			} else {
				$middlePane = 'nowPlaying';
			}
		}
	}

	let persons = [];

	$: if ($selectedEpisode) {
		persons = [];
		let p = false;
		if ($selectedEpisode.podcastPerson) {
			p = true;
			if ($selectedEpisode.podcastPerson.length) {
				persons = $selectedEpisode.podcastPerson;
			} else {
				persons = [$selectedEpisode.podcastPerson];
			}
		}

		if (p) {
			let temp = [];
			if ($selectedEpisode.person) {
				if ($selectedEpisode.person.length) {
					temp = $selectedEpisode.person;
				} else {
					temp = [$selectedEpisode.person];
				}

				for (let p of persons) {
					if (temp.findIndex(({ img }) => img === p.img) === -1) {
						temp.push(p);
					}
				}
				persons = [...temp];
			}
		} else {
			if ($selectedEpisode.person) {
				if ($selectedEpisode.person.length) {
					persons = $selectedEpisode.person;
				} else {
					persons = [$selectedEpisode.person];
				}
			}
		}
	}

	function handleImgError(e) {
		let elem = e.target;
		elem.parentNode.removeChild(elem);
	}

	let imageSizer = '&w=480&h=480';
	$: headerImg = $selectedEpisode?.image || $selectedPodcast?.image || $selectedPodcast?.artwork;
</script>

<head>
	{#if $selectedEpisode}
		<Image src={headerImg} style={`height: 100px; border-radius: 5px;`} />

		<button class="shownotes-load-episode-button" on:click={startEpisode}>
			{#if $playingPodcast?.title === $selectedPodcast?.title && $playingEpisode?.title === $selectedEpisode?.title && !$playerIsPaused}<Pause
					size="36px"
				/>{:else}<PlayArrow size="36px" />
			{/if}
		</button>
		<h3>{$selectedEpisode.title}</h3>
	{/if}
</head>

<style>
	head {
		display: flex;
		position: relative;
		align-items: flex-start;
		padding: 8px 8px 0 8px;
		height: 100px;
		color: var(--primary-text-color);
	}

	h3 {
		min-height: 42px;
		max-height: 100px;
		margin: 0;
		text-align: center;
		overflow: hidden;
		line-height: 1.3em;
	}

	button {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 42px;
		margin: 0;
	}

	:global(.shownotes-load-episode-button:hover > svg) {
		color: var(--primary-text-color);
		transform: scale(1.2);
		transition-duration: 0.2s;
	}
</style>
