<script>
	import { onMount } from 'svelte';
	import { modalSwiper, modalSwiperType } from '$/stores';
	import { fly } from 'svelte/transition';

	import Preferences from './Modal/Preferences.svelte';
	import WalletSettings from '$lib/Modals/Wallet/WalletSettings/WalletSettingsSwiper.svelte';
	import OPML from '$lib/Modals/OPML/OPMLSwiper.svelte';
	import Disclaimer from '$lib/Modals/Disclaimer/DisclaimerSwiper.svelte';
	import Boostagram from '$lib/Modals/Wallet/Boostagram/BoostagramSwiper.svelte';
	import ImportOPML from '$lib/Modals/OPML/ImportSwiper.svelte';

	onMount(() => {
		$modalSwiper = new Swiper('.modal-swiper', {
			direction: 'vertical',
			allowTouchMove: true,
			resistanceRatio: 0
		});

		$modalSwiper.on('slideChange', function () {
			let m = $modalSwiper;

			let i = m.activeIndex;
			if (i) {
				m.$el[0].style = 'z-index:3';
				m.allowTouchMove = true;
			} else {
				m.allowTouchMove = false;
				setTimeout(() => (m.$el[0].style = ''), 250);
			}
		});
	});
</script>

<div class="swiper modal-swiper">
	<div class="swiper-wrapper">
		<div class="swiper-slide" />
		<div class="swiper-slide blurred">
			<div class="pane">
				{#if $modalSwiperType === 'preferences'}
					<div class="modal preferences" transition:fly={{ y: 600, duration: 400 }}>
						<Preferences />
					</div>
				{/if}
				{#if $modalSwiperType === 'wallet'}
					<div class="modal wallet-settings" transition:fly={{ y: 600, duration: 400 }}>
						<WalletSettings />
					</div>
				{/if}
				{#if $modalSwiperType === 'opml'}
					<div class="modal opml" transition:fly={{ y: 600, duration: 400 }}>
						<div>
							<OPML />
						</div>
					</div>
				{/if}
				{#if $modalSwiperType === 'disclaimer'}
					<div class="modal disclaimer" transition:fly={{ y: 600, duration: 400 }}>
						<div>
							<Disclaimer />
						</div>
					</div>
				{/if}
				{#if $modalSwiperType === 'boostagram'}
					<div class="modal boostagram" transition:fly={{ y: 600, duration: 400 }}>
						<Boostagram />
					</div>
				{/if}
				{#if $modalSwiperType === 'importOpml'}
					<div class="modal import-opml" transition:fly={{ y: 600, duration: 400 }}>
						<ImportOPML />
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.modal-swiper {
		top: 0;
		width: 100%;
		height: calc(100% - 65px);
		position: absolute;
	}

	.pane {
		height: calc(100% - 15px);
		overflow: hidden;
		background-color: var(--secondary-color);
		background: linear-gradient(var(--shownotes-color-light), var(--shownotes-color-dark));
		border-radius: 8px 8px 0 0;
		box-shadow: 0px 0px 10px -3px rgb(0, 0, 0);
		position: relative;
	}

	.modal {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.preferences {
		padding: 8px;
	}
	.wallet-settings {
		display: flex;
		flex-direction: column;
	}

	.opml {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.disclaimer {
		padding: 8px;
	}

	.blurred {
		background-color: transparent;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
</style>
