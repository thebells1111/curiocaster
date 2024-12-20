<script>
	import { showPodcastSearch, podcastSearchResults, remoteServer } from '$/stores';

	export let searchQuery = '';
	export let resultsContainer;

	async function queryPodcastDB() {
		if (searchQuery) {
			$podcastSearchResults.cat = 'Search Results';
			$podcastSearchResults.feeds = new Array(20).fill({ image: 'waiting' });
			const res = await fetch(
				remoteServer + 'api/queryindex?search/byterm?q=' + `${encodeURIComponent(searchQuery)}`,
				{
					credentials: 'same-origin'
				}
			);
			res.json().then((data) => {
				$podcastSearchResults.feeds = data?.feeds || [];
				$podcastSearchResults = $podcastSearchResults;
			});
			resultsContainer.scrollTo({ left: 0, top: 0 });
		}
	}

	function handleEnter(e) {
		if (e.key === 'Enter') {
			queryPodcastDB();
			$showPodcastSearch = true;
		}
	}

	function selectText(e) {
		e.target.select();
	}
</script>

<!-- svelte-ignore a11y-autofocus -->
<input
	type="text"
	bind:value={searchQuery}
	on:keypress={handleEnter}
	on:focus={selectText}
	placeholder="Search Here"
/>

<style>
	input {
		margin: 0.5em auto;
		border-radius: 5em;
		outline: none;
		width: calc(100% - 130px);
		height: 42px;
		text-align: center;
		display: block;
	}
</style>
