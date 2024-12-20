<script>
	import Header from './Header.svelte';
	import EpisodeList from './EpisodeList.svelte';

	import { selectedPodcast, showRecentEpisodes } from '$/stores';

	let listHeight = 500;
	let headerHeight = 80;
	let sectionHeight;
	let sectionWidth;

	$: if (sectionHeight && headerHeight) {
		listHeight = sectionHeight - headerHeight - 15;
	}
</script>

{#if $selectedPodcast?.id || $showRecentEpisodes}
	<section bind:clientHeight={sectionHeight} bind:clientWidth={sectionWidth}>
		<Header bind:headerHeight />
		<EpisodeList bind:listHeight bind:sectionWidth fromSubscriptions={true} />
	</section>
{/if}

<style>
	section {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		overflow: hidden;
		background-color: var(--primary-color);
	}
	:global(.virtual-list-wrapper) {
		overflow-x: hidden !important;
	}
</style>
