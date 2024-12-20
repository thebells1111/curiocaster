<script>
	import { onMount } from 'svelte';
	import getRSS from '$functions/getRSSFeed';

	import FeaturedList from '$lib/featured/Featured.svelte';
	import Image from '$functions/Image.svelte';
	import {
		featuredPodcasts,
		selectedPodcast,
		episodesList,
		filteredEpisodesList,
		selectedEpisode,
		currentDesktopView,
		liveEpisodes,
		remoteServer
	} from '$/stores';

	let containerWidth;

	$: columns = Math.floor(containerWidth / 204);

	function getPodcast(podcast) {
		$liveEpisodes = [];
		$currentDesktopView = 'mainScreen';
		$filteredEpisodesList = [];
		let urls = [
			remoteServer + `api/queryindex?q=podcasts/byfeedid?id=` + podcast.id,
			remoteServer +
				`api/queryindex?q=episodes/byfeedid?` +
				encodeURIComponent(`id=${podcast.id}&max=1000`)
		];
		Promise.all(urls.map((url) => fetch(url).then((response) => response.json()))).then((data) => {
			if (data[0].status) {
				let feed = data[0].feed;
				feed.episodes = data[1].items;
				$selectedPodcast = feed;
				$episodesList = feed.episodes || [];
				$filteredEpisodesList = feed.episodes || [];
				podcast = feed;
				console.log(feed);

				$selectedEpisode = $filteredEpisodesList[0];
			}
		});
		getRSS(podcast.url);
		window.history.replaceState(null, null, window.location.origin + '/podcast/pi' + podcast.id);
	}

	onMount(async () => {
		for (let v of $featuredPodcasts.feeds) {
			if (v.dynamicImage) {
				let res = await fetch(remoteServer + `api/queryindex?q=podcasts/byfeedid?id=` + v.id);
				let data = await res.json();
				let feed = data.feed;

				v.artwork = feed.artwork;
				$featuredPodcasts = $featuredPodcasts;
			}
		}
	});
</script>

<FeaturedList />
<h2>Promoted Podcasts</h2>
<div
	class="width-calc"
	bind:clientWidth={containerWidth}
	style="--column-count:{columns}; --card-container-width:{columns * 204}px"
>
	<div class="card-container">
		{#each $featuredPodcasts?.feeds as podcast}
			<div class="card" on:click={getPodcast.bind(this, podcast)}>
				<Image src={podcast.artwork} style={`width: 180px; border-radius: 6px;`} />
				<div class="podcast-info" />
				<p>{podcast.title}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.width-calc {
		width: 100%;
	}
	.card-container {
		padding: 4px;
		display: grid;
		grid-template-columns: repeat(var(--column-count), 204px);
		margin: 0 auto;
		gap: 0;
		width: var(--card-container-width);
	}

	.card {
		padding: 8px;
		margin: 4px;
		color: var(--primary-text-color);
		background-color: var(--primary-color);
		border-radius: 8px;
		width: 196px;
		cursor: pointer;
	}

	h2 {
		margin: 0 16px;
	}
	p {
		margin: 0;
		padding: 0;
		font-weight: 550;
	}
</style>
