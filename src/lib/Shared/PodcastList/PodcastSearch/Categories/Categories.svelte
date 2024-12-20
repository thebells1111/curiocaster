<script>
	import { podcastSearchResults, podcastListPane } from '$/stores';

	import cArray from './categories.json';

	let allCategories = cArray.sort((a, b) => (a.name < b.name ? -1 : 1));
	// .filter(({ id }) => id !== 35);
	let filteredCategories = allCategories;

	async function getFeeds(cat) {
		const res = await fetch(`/api/recentfeeds.js?cat=${cat.id}&lang=en`, {
			credentials: 'same-origin'
		});

		let data = await res.json();

		$podcastSearchResults.cat = cat.name;
		$podcastSearchResults.feeds = data.feeds;
		$podcastSearchResults = $podcastSearchResults;
		$podcastListPane = 'search';
	}
</script>

<div class="cat-container">
	<div>
		{#each filteredCategories as cat}
			<button on:click={getFeeds.bind(this, cat)}>
				{cat.name}
			</button>
		{/each}
	</div>
</div>

<style>
	.cat-container {
		width: 100%;
		overflow: auto;
		display: flex;
		justify-content: center;
	}

	button {
		width: calc(50% - 4px);
		height: 44px;
		background-color: transparent;
		margin: 2px;
		padding: 0;
	}
</style>
