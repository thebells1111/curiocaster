<script>
	import { onMount } from 'svelte';
	import Header from './Header.svelte';
	import ShowNotes from '$lib/Shared/4-EpisodeData/ShowNotes/ShowNotes.svelte';
	import Chapters from '$lib/Shared/4-EpisodeData/Chapters/Chapters.svelte';
	import Transcripts from '$lib/Shared/4-EpisodeData/Transcripts/Transcripts.svelte';

	import {
		rightPane,
		showNotesPane,
		selectedEpisode,
		showNotesModalSwiper,
		playingEpisode,
		showMobileChat
	} from '$/stores';

	let initialTabs = [{ type: 'showNotes', name: 'Show Notes', index: 0, component: ShowNotes }];
	let tabs = [...initialTabs];

	onMount(() => {
		$showNotesModalSwiper = new Swiper('.shownotes-modal-swiper', {});
		$showNotesModalSwiper.on('slideChange', function () {
			$rightPane = tabs[$showNotesModalSwiper.activeIndex].type;
		});
	});

	$: if ($selectedEpisode && $showNotesModalSwiper) {
		//reset show status on new episode
		tabs = [...initialTabs];

		selectTab(tabs[0]);

		if ($selectedEpisode.chaptersUrl) {
			let index = tabs.length;
			tabs.push({ type: 'chapters', name: 'Chapters', index: index, component: Chapters });
		}
		if (
			$selectedEpisode?.transcripts &&
			$selectedEpisode?.transcripts?.find(
				({ type }) =>
					type === 'application/srt' || type === 'text/srt' || type === 'application/x-subrip'
			)
		) {
			let index = tabs.length;
			tabs.push({
				type: 'transcripts',
				name: 'Transcripts ',
				index: index,
				component: Transcripts
			});
		}

		$showNotesModalSwiper?.update();
	}

	function selectTab(tab) {
		$showNotesModalSwiper.slideTo(tab.index);
		$rightPane = tab.type;
	}

	let transcriptOffset;
</script>

<div class="right-pane">
	<Header />
	<section class="tab-zone">
		{#each tabs as tab}
			<button class:active={$rightPane === tab.type} on:click={selectTab.bind(this, tab)}>
				<p>{tab.name}</p>
			</button>
		{/each}
	</section>

	<div bind:this={$showNotesPane} class="notes">
		<div class="swiper shownotes-modal-swiper">
			<div class="swiper-wrapper">
				{#each tabs as tab}
					<div class="swiper-slide">
						<svelte:component this={tab.component} episode={$selectedEpisode} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.shownotes-modal-swiper {
		height: 100%;
	}
	.tab-zone {
		display: flex;
		position: relative;
	}

	.right-pane {
		display: flex;
		flex-direction: column;
		height: calc(100% - 16px);
		color: var(--primary-text-color);
		background: linear-gradient(var(--shownotes-color-light), var(--shownotes-color-dark));
		position: relative;
		top: 16px;
		border-radius: 8px 8px 0 0;
		z-index: 33;
		box-shadow: 0px 0px 10px -3px rgb(0, 0, 0);
	}
	.notes {
		height: 100%;
		overflow: hidden;
	}

	.tab-zone button {
		width: 100%;
		height: 50px;
		background-color: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.tab-zone button > p {
		margin: 0;
		padding: 0;
		width: 100px;
		text-align: center;
		position: relative;
	}

	button.active > p {
		font-weight: 600;
		font-size: 1.05em;
		border-bottom-color: transparent;
		color: var(--accent-color-blue);
		transition: 0.2s ease-in-out;
	}
</style>
