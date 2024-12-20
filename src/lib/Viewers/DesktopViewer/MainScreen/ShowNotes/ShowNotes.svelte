<script>
	import { selectedEpisode, currentEpisodeData, playingEpisode } from '$/stores';

	import ShowNotes from '$lib/Shared/4-EpisodeData/ShowNotes/ShowNotes.svelte';
	import Chapters from '$lib/Shared/4-EpisodeData/Chapters/Chapters.svelte';
	import Transcripts from '$lib/Shared/4-EpisodeData/Transcripts/Transcripts.svelte';
	import ShowNotesHeader from './ShowNotesHeader.svelte';

	export let nowPlaying = false;

	function getTitle() {
		let title = nowPlaying ? $playingEpisode.title : $selectedEpisode?.title;
		return title || '  ';
	}
</script>

<div class="card">
	<div class="shownotes-header">
		<ShowNotesHeader episode={nowPlaying ? $playingEpisode : $selectedEpisode} />
		<h3>{getTitle($playingEpisode.title, $selectedEpisode?.title)}</h3>
	</div>

	<div class="scroll-bar-clipper">
		<div class="podcast-data">
			<div class:hide={$currentEpisodeData !== 'showNotes'}>
				<ShowNotes episode={nowPlaying ? $playingEpisode : $selectedEpisode} />
			</div>
			<div class:hide={$currentEpisodeData !== 'chapters'}>
				<Chapters episode={nowPlaying ? $playingEpisode : $selectedEpisode} />
			</div>
			<div class="transcripts" class:hide={$currentEpisodeData !== 'transcripts'}>
				<Transcripts episode={nowPlaying ? $playingEpisode : $selectedEpisode} />
			</div>
		</div>
	</div>
</div>

<style>
	.scroll-bar-clipper {
		width: calc(100%);
		height: calc(100% - 71px);
		border-radius: 4px;
		overflow: auto;
		z-index: 3;
		position: relative;
		overflow: hidden;
	}

	.podcast-data {
		width: 100%;
		height: 100%;
		position: relative;
		/* background-color: var(--primary-color); */
		color: var(--primary-text-color);
		overflow: auto;
		padding: 8px;
	}

	.transcripts {
		height: calc(100% - 25px);
	}

	.card {
		width: 390px;
		margin-left: 10px;
		margin-top: 10px;
		height: calc(100% - 10px);
		background: var(--secondary-accent-color-light);
		background: linear-gradient(var(--shownotes-color-light), var(--shownotes-color-dark));
		border-radius: 6px;

		overflow-x: hidden;
		cursor: pointer;
	}

	h3 {
		color: var(--secondary-text-color);
		margin: 0;
		text-align: center;
	}

	.shownotes-header {
		position: relative;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--border-color);
		color: var(--primary-text-color);
	}

	.hide {
		display: none;
	}
</style>
