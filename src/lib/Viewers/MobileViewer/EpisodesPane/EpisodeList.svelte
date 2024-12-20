<script>
	import VirtualList from 'svelte-tiny-virtual-list';
	import EpisodeListItem from './EpisodeListItem.svelte';
	import EpisodeListLoadingItems from './EpisodeListLoadingItems.svelte';

	import {
		selectedPodcast,
		filteredEpisodesList,
		filteringEpisodes,
		listSwiper,
		liveEpisodes,
		showRecentEpisodes
	} from '$/stores';

	export let listHeight = 500;

	let episodesOffset = 0;
	let yPosStart = 0;
	let scrollToIndex = 0;

	$: console.log($liveEpisodes);

	$: listOfEpisodes = $showRecentEpisodes
		? $filteredEpisodesList
		: $liveEpisodes.concat($filteredEpisodesList);
</script>

{#if $selectedPodcast?.id || $showRecentEpisodes}
	{#if listOfEpisodes && listOfEpisodes?.length}
		<div
			class="list-height"
			bind:clientHeight={listHeight}
			on:touchstart={(e) => {
				let touch = e.touches[0] || e.changedTouches[0];
				yPosStart = touch.pageY;
				$listSwiper.allowTouchMove = false;
			}}
			on:touchmove={(e) => {
				let touch = e.touches[0] || e.changedTouches[0];
				if (episodesOffset === 0 && yPosStart < touch.pageY) {
					$listSwiper.allowTouchMove = true;
				}
			}}
			on:touchend={() => {
				$listSwiper.allowTouchMove = true;
			}}
		>
			<VirtualList
				bind:height={listHeight}
				width="100%"
				{scrollToIndex}
				itemCount={listOfEpisodes?.length}
				itemSize={186}
				overscanCount={5}
				on:afterScroll={(e) => (episodesOffset = e.detail.offset)}
			>
				<div slot="item" let:index let:style {style} class="row">
					<EpisodeListItem episode={listOfEpisodes?.[index]} />
				</div>
			</VirtualList>
		</div>
	{:else if $filteringEpisodes}
		<p>No Matching Episodes</p>
	{:else}
		{#each [1, 2, 3, 4, 5] as episode}
			<EpisodeListLoadingItems />
		{/each}
	{/if}
{/if}

<style>
	.list-height {
		height: 100%;
	}
	:global(.virtual-list-wrapper) {
		overflow-x: hidden !important;
	}
	p {
		text-align: center;
	}
</style>
