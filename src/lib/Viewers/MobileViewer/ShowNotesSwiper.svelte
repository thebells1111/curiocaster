<script>
	import { onMount } from 'svelte';
	import EpisodeData from '$lib/Viewers/MobileViewer/EpisodeData/EpisodeData.svelte';

	import { swiper, showNotesVerticalSwiper, rightPane } from '$/stores';

	onMount(() => {
		$showNotesVerticalSwiper = new Swiper('.shownotes-swiper', {
			direction: 'vertical',
			allowTouchMove: true,
			resistanceRatio: 0
		});

		$showNotesVerticalSwiper.on('slideChange', function () {
			let s = $showNotesVerticalSwiper;
			$rightPane = 'showNotes';

			let i = s.activeIndex;
			if (i) {
				s.allowTouchMove = true;
				s.$el[0].style = 'position:absolute';
			} else {
				s.allowTouchMove = false;
				setTimeout(() => (s.$el[0].style = ''), 250);
			}
		});
	});
</script>

<div class="swiper shownotes-swiper">
	<div class="swiper-wrapper">
		<div class="swiper-slide" />
		<div class="swiper-slide blurred">
			<div class="pane">
				<EpisodeData />
			</div>
		</div>
	</div>
</div>

<style>
	.shownotes-swiper {
		top: 0;
		width: 100%;
		height: 100%;
	}

	.pane {
		height: 100%;
		overflow: auto;
		background-color: transparent;
		position: relative;
	}
</style>
