<script>
	import Wallet from '$lib/icons/Wallet.svelte';

	import { showWallet, modalSwiper, modalSwiperType, showMobile } from '$/stores';

	function openWallet() {
		if ($showMobile) {
			$modalSwiperType = 'wallet';
			$modalSwiper.slideTo(1);
		} else {
			$showWallet = true;
		}
	}
</script>

<div class="icon-container share">
	<button on:click={openWallet} class="icon-button wallet">
		<Wallet size="16" />
		<p>Wallet</p></button
	>
</div>

<style>
	.icon-container {
		width: 42px;
	}

	.icon-button {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 42px;
		margin: 0;
		color: var(--primary-text-color);
		transform: scale(1);
		transition-duration: 0.2s;
		display: flex;
		align-self: flex-end;
	}

	/* .icon-button:hover {
    color: #111;
    transform: scale(1.2);
    transition-duration: 0.2s;
  } */

	.icon-button.wallet {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.icon-button.wallet > p {
		padding: 0;
		margin: 0;
		font-size: 0.8em;
	}
</style>
