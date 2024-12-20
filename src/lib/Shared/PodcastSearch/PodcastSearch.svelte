<script>
	import {
		podcastListPane,
		podcastSearchResults,
		remoteServer,
		showMobile,
		currentDesktopView,
		currentList
	} from '$/stores';

	let filterText = '';
	export let searchBar;
	export let isSearchFocused = false;

	async function handleFilterTextInput(e) {
		// if ($podcastListPane === 'subscriptions') {
		//   $podcastList = $mainPodcastList.filter((podcast) =>
		//     podcast.title.toLowerCase().includes(filterText.toLowerCase())
		//   );
		// } else
		if (e.key === 'Enter' && filterText !== '') {
			let text = filterText;
			e.target.blur();

			$podcastListPane = 'search';

			$podcastSearchResults.cat = text;
			$podcastSearchResults.feeds = new Array(20).fill({
				image: 'waiting',
				title: ''
			});

			let url = remoteServer + `api/queryindex?q=${encodeURIComponent(`search/byterm?q=${text}`)}`;

			$currentList = 'podcastList';
			$currentDesktopView = 'mainScreen';

			const res = await fetch(url, {
				credentials: 'same-origin'
			});
			console.log(res);
			res.json().then((data) => {
				console.log(data);
				$podcastSearchResults.feeds = data?.feeds || [];
				$podcastSearchResults = $podcastSearchResults;
			});
		}
	}

	function handleFilterTextSelect(e) {
		e.target.placeholder = '';
		filterText = '';
		// $podcastList = $mainPodcastList;
		isSearchFocused = true;
	}
	function handleFilterTextBlur(e) {
		e.target.placeholder = 'find new podcasts';
		filterText = '';
		isSearchFocused = false;
	}
</script>

<input
	type="search"
	bind:this={searchBar}
	bind:value={filterText}
	placeholder={'find new podcasts'}
	on:focus={handleFilterTextSelect}
	on:blur={handleFilterTextBlur}
	on:keydown={handleFilterTextInput}
/>

<style>
	input {
		width: 100%;
		outline: none;
		margin: 0;
		border: none;
		text-align: center;
		background-color: transparent;
		padding: 4px;
		padding-right: 12px;
		color: var(--primary-text-color);
		position: relative;
		left: 10px;
	}

	::placeholder {
		color: var(--secondary-text-color);
		opacity: 1;
	}
</style>
