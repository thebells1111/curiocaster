<script>
	import { onMount } from 'svelte';
	import { supportSwiper } from '$/stores';

	import BoostagramSwiper from '$lib/Modals/Wallet/Boostagram/BoostagramSwiper.svelte';
	onMount(() => {
		$supportSwiper = new Swiper('.support-swiper', {
			direction: 'vertical',
			allowTouchMove: true,
			resistanceRatio: 0
		});

		$supportSwiper.on('slideChange', function () {
			let m = $supportSwiper;

			let i = m.activeIndex;
			if (i) {
				m.$el[0].style = 'z-index:6';
				m.allowTouchMove = true;
			} else {
				m.allowTouchMove = false;
				setTimeout(() => (m.$el[0].style = ''), 250);
			}
		});
	});
</script>

<div class="swiper support-swiper">
	<div class="swiper-wrapper">
		<div class="swiper-slide" />
		<div class="swiper-slide blurred">
			<div class="pane">
				<BoostagramSwiper curioSupport={true} />
			</div>
		</div>
	</div>
</div>

<style>
	.support-swiper {
		top: 0;
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: -1;
	}

	.pane {
		height: calc(100% - 30px);
		overflow: hidden;
		background-color: var(--secondary-color);
		background: linear-gradient(var(--shownotes-color-light), var(--shownotes-color-dark));
		border-radius: 8px 8px 0 0;
		box-shadow: 0px 0px 20px -3px rgb(0, 0, 0);
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

	.modal {
		padding: 8px;
	}

	.invoice {
		display: flex;
		flex-direction: column;
	}

	.streaming-amounts {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.pay-invoice {
		height: 100%;
		padding: 0;
	}
</style>
