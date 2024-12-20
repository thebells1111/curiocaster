<script>
	import { onMount } from 'svelte';
	import { playlistSwiper } from '$/stores';

	import PlayList from '$lib/Shared/PlayList/PlayList.svelte';

	onMount(() => {
		$playlistSwiper = new Swiper('.playlist-swiper', {
			direction: 'vertical',
			allowTouchMove: true,
			resistanceRatio: 0
		});

		$playlistSwiper.on('slideChange', function () {
			let m = $playlistSwiper;

			let i = m.activeIndex;
			console.log(i);
			if (i) {
				m.$el[0].style = 'z-index:4';
				m.allowTouchMove = true;
			} else {
				m.allowTouchMove = false;
				setTimeout(() => (m.$el[0].style = ''), 250);
			}
		});
	});
</script>

<div class="swiper playlist-swiper">
	<div class="swiper-wrapper">
		<div class="swiper-slide" />
		<div class="swiper-slide blurred">
			<div class="pane">
				<div>
					<PlayList />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.playlist-swiper {
		top: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: -1;
	}

	.pane {
		height: calc(100% - 15px);
		overflow: hidden;
		background-color: transparent;
		background: linear-gradient(var(--shownotes-color-light), var(--shownotes-color-dark));
		border-radius: 8px 8px 0 0;
		box-shadow: 0px 0px 10px -3px rgb(0, 0, 0);
	}

	.pane > div {
		height: 100%;
	}

	.blurred {
		background-color: transparent;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
</style>
