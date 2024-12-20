<script>
	import {
		currentEpisodeData,
		selectedEpisode,
		showSubscriptionShowNotes,
		currentDesktopView,
		playingEpisode
	} from '$/stores';

	let showChapters;
	let showTranscripts;
	let showChat;
	export let episode;

	function handleListClick(screen) {
		$currentEpisodeData = screen;
	}

	$: if (episode) {
		$currentEpisodeData = 'showNotes';
		showChapters = false;
		showTranscripts = false;
		if (episode.chaptersUrl) {
			showChapters = true;
		}

		if (
			episode?.transcripts &&
			episode?.transcripts?.find(
				({ type }) =>
					type === 'application/srt' || type === 'text/srt' || type === 'application/x-subrip'
			)
		) {
			showTranscripts = true;
		}

		if ($playingEpisode?.chat && $playingEpisode?.chat === episode?.chat) {
			showChat = true;
		}
	}
</script>

<ul>
	<li
		class:active={$currentEpisodeData === 'showNotes'}
		on:click|stopPropagation={handleListClick.bind(this, 'showNotes')}
	>
		Show Notes
	</li>
	{#if showChapters}
		<li
			class:active={$currentEpisodeData === 'chapters'}
			on:click|stopPropagation={handleListClick.bind(this, 'chapters')}
		>
			Chapters
		</li>
	{/if}
	{#if showTranscripts}
		<li
			class:active={$currentEpisodeData === 'transcripts'}
			on:click|stopPropagation={handleListClick.bind(this, 'transcripts')}
		>
			Transcripts
		</li>
	{/if}
	{#if showChat}
		<li
			class:active={$currentEpisodeData === 'chat'}
			on:click|stopPropagation={() => {
				$showSubscriptionShowNotes = false;
				$currentDesktopView = 'chat';
			}}
		>
			Chat
		</li>
	{/if}

	<!-- <li
		class:active={$currentEpisodeData === 'comments'}
		on:click|stopPropagation={handleListClick.bind(this, 'comments')}
	>
		Comments
	</li> -->
</ul>

<style>
	ul {
		display: flex;
	}
	li {
		list-style: none;
		margin: 8px;
		cursor: pointer;
		font-weight: 550;
		color: var(--primary-text-color);
	}

	.active {
		color: var(--menu-active-color);
	}
</style>
