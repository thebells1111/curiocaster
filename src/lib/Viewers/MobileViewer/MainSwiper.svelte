<script>
	import { onMount } from 'svelte';
	import PodcastList from '$lib/Shared/PodcastList/PodcastList.svelte';
	import PlayerPane from './PlayerPane/PlayerPane.svelte';
	import ListSwiper from './ListSwiper.svelte';
	import PlaylistSwiper from './PlaylistSwiper.svelte';

	import { swiper } from '$/stores';

	onMount(() => {
		$swiper = new Swiper('.main-swiper', { initialSlide: 1, slidesPerView: 1 });
	});
</script>

<div class="swiper main-swiper">
	<div class="swiper-wrapper">
		<div class="swiper-slide">
			<PlayerPane />
		</div>
		<div class="swiper-slide">
			<div class="pane">
				<PodcastList />
				<ListSwiper />
				<PlaylistSwiper />
			</div>
		</div>
	</div>
</div>

<style>
	.main-swiper {
		width: 100%;
		height: 100%;
		z-index: 2;
	}

	.pane {
		height: 100%;
		overflow: hidden;
	}
</style>
