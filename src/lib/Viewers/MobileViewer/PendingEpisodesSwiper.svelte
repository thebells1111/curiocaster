<script>
	import PendingEpisodes from '$lib/Modals/PendingEpisodes/PendingEpisodesSwiper.svelte';
	import { onMount } from 'svelte';

	import { pendingEpisodesSwiper } from '$/stores';

	onMount(() => {
		$pendingEpisodesSwiper = new Swiper('.pending-episode-swiper', {
			direction: 'vertical',
			allowTouchMove: true,
			resistanceRatio: 0
		});

		$pendingEpisodesSwiper.on('slideChange', function () {
			let s = $pendingEpisodesSwiper;

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

<div class="swiper pending-episode-swiper">
	<div class="swiper-wrapper">
		<div class="swiper-slide" />
		<div class="swiper-slide blurred">
			<div class="pane">
				<PendingEpisodes />
			</div>
		</div>
	</div>
</div>

<style>
	.pending-episode-swiper {
		top: 0;
		width: 100%;
		height: 100%;
	}

	.pane {
		height: 100%;
		overflow: hidden;
		background-color: transparent;
		position: relative;
	}
</style>
