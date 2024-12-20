<script>
	import { podcastList, mainPodcastList, showPodcastFilter } from '$/stores';

	let filterText = '';
	let filterInput;

	$: if (!$showPodcastFilter) {
		if (filterInput) {
			setTimeout(() => {
				filterText = '';
				if (filterInput?.placeholder) {
					filterInput.placeholder = 'filter subscriptions';
				}
			}, 350);
		}
	}

	async function handleFilterTextInput(e) {
		$podcastList = $mainPodcastList.filter((podcast) =>
			podcast.title.toLowerCase().includes(filterText.toLowerCase())
		);
	}

	async function handleFilterChange(e) {
		console.log(filterText);
	}

	function handleFilterTextSelect(e) {
		e.target.placeholder = '';
		filterText = '';
		$podcastList = $mainPodcastList;
	}
</script>

<div class:show={$showPodcastFilter}>
	<input
		bind:this={filterInput}
		type="search"
		bind:value={filterText}
		placeholder="filter subscriptions"
		on:focus={handleFilterTextSelect}
		on:input={handleFilterTextInput}
	/>
</div>

<style>
	div {
		width: calc(100% - 16px);
		margin: 0px 8px;
		height: 0px;
		opacity: 0;
		background-color: transparent;
		border-radius: 30px;
		border: 1px solid var(--border-color);
		display: flex;
		padding: 0 4px;
		transition: height 0.2s, opacity 0.2s;
	}

	.show {
		margin: 4px 8px;
		height: 30px;
		opacity: 1;
		transition: height 0.2s, opacity 0.2s;
	}
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
	}
</style>
