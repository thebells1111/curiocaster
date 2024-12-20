<script>
	import Spinner from '$lib/Shared/Spinner.svelte';

	import { showWalletKeys, userState, showWallet, loggedIn } from '$/stores';

	import createWallet from '$functions/createWallet';

	let showSpinner = false;

	function hideWallet() {
		$showWalletKeys = false;
		wak = '';
		pak = '';
		saveState = 'Save';
		if ($userState?.wallet?.saved) {
			$showWallet = true;
		}
	}
</script>

<section class="wallet-keys" class:active={$showWalletKeys && $loggedIn} on:click|self={hideWallet}>
	<div class="scroll-bar-clipper">
		{#if showSpinner}
			<div class="spinner">
				<Spinner />
			</div>
		{/if}
		<p>
			This feature is experimental, and may result in the loss of funds. Please consider any funds
			you use the cost of freedom, and only risk what you're willing to lose.
		</p>
		<p>
			After creating a wallet to hold your funds, a QR Code and link will appear. Use your favorite
			Lightning Network wallet or app to send funds to your new CurioCaster wallet.
		</p>
		<p>
			After your wallet is funded, you'll be able to stream, boost, or tip sats to any value enabled
			podcast.
		</p>

		<button on:click={createWallet}>Create Wallet</button>
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		background-color: hsla(0, 0%, 0%, 0.65);
		height: 100vh;
		width: 100vw;
		color: #ddd;
		display: none;
		place-items: center;
		z-index: 9999;
	}

	.active {
		display: grid;
	}

	.scroll-bar-clipper {
		width: calc(100% - 16px);
		max-width: 720px;
		padding: 8px;
		height: auto;
		min-height: 300px;
		background-color: #fff;
		color: #333;
		border-radius: 5px;
		overflow: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
	}

	.spinner {
		position: fixed;
		top: 0;
		left: 0;
		display: grid;
		place-content: center center;
		width: 100vw;
		height: 100vh;
		z-index: 5;
	}

	button {
		min-height: 50px;
		width: 100%;
		max-width: 720px;
		align-self: center;
		background-color: #333;
		color: #fff;
		border-radius: 50px;
	}
</style>
