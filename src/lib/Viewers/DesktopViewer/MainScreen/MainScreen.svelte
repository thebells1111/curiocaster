<script>
	import { fly } from 'svelte/transition';

	import PodcastList from '$lib/Shared/PodcastList/PodcastList.svelte';
	import Episodes from './Episodes/Episodes.svelte';
	import PodcastData from './PodcastData.svelte';
	import ShowNotes from './ShowNotes/ShowNotes.svelte';
	import ShowNotesModal from './ShowNotes/ShowNotesModal.svelte';

	import { showRecentEpisodes } from '$/stores';
</script>

<div class="main-screen-container">
	<div class="podcast-list">
		<PodcastList />
	</div>

	<div class="episodes">
		<Episodes />
	</div>
	<div class:hide={!$showRecentEpisodes}>
		<ShowNotes />
	</div>

	<div class:hide={$showRecentEpisodes}>
		<PodcastData />
	</div>
	<ShowNotesModal nowPlaying={false} />
</div>

<style>
	.main-screen-container {
		width: 100%;
		height: 100%;
		display: flex;
		position: relative;
		overflow: hidden;
	}

	.podcast-list {
		min-width: 275px;
		width: 275px;
		border-radius: 8px;
		margin-left: 8px;
	}

	.episodes {
		flex-grow: 1;
		max-width: calc(100% - 683px);
	}

	.hide {
		display: none;
	}
</style>
