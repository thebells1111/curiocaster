<script>
	import Filter from '$lib/icons/Filter.svelte';
	import Search from '$lib/icons/Search.svelte';
	import { showPodcastFilter, mainPodcastList, podcastList, showMobile } from '$/stores';
</script>

<div>
	<button
		id="podcast-settings-button"
		on:click={() => {
			$showPodcastFilter = !$showPodcastFilter;
			$podcastList = $mainPodcastList;
		}}
		aria-label="Podcast Settings"
	>
		{#if $showMobile && $showPodcastFilter}
			<Search size="27px" color="var(--primary-text-color)" />
		{:else}
			<Filter size="20px" color="var(--primary-text-color)" />
		{/if}
	</button>
</div>

<style>
	div {
		position: relative;
		height: 36px;
	}

	button {
		background-color: transparent;
		margin: 0;
		padding: 0;
		border: none;
		height: 36px;
		min-width: 36px;
		display: grid;
		place-content: center center;
	}

	button:active {
		color: #111;
	}
</style>
