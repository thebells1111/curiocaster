<script>
	import Boostagram from '$lib/Modals/Wallet/Boostagram/BoostagramModal.svelte';

	import { showWallet, loggedIn, showSupport } from '$/stores';

	function displayShowSupport() {
		if (!$loggedIn) {
			$showWallet = true;
		} else {
			$showSupport = true;
		}
	}
</script>

<div class="container">
	<div class="card">
		<p>
			CurioCaster is a value 4 value app. <br />If you like using CurioCaster, then support
			CurioCaster. <br />It's because of apps like CurioCaster that you are able to stream and boost
			your favorite podcasters. <br />Don't forget to boost the app developers that make it all
			possible.
			<br />You can boost CurioCaster clicking the button below.
			<br />CurioCaster can also be supported through cashApp.
		</p>

		<button class="primary" on:click={displayShowSupport}>Boost CurioCaster!!!</button>

		<img src="/$curiocaster.png" />
		<p>$curiocaster</p>
	</div>
</div>
{#if $showSupport}
	<Boostagram curioSupport={true} />
{/if}

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 16px 16px;
		border-radius: 8px;
		background-color: var(--episode-card-color);
		border: var(--modal-border);
		box-shadow: var(--modal-box-shadow);
	}

	p {
		text-align: center;
		padding: 0 0 8px 0;
	}

	button.primary {
		margin: 32px 0;
		width: 300px;
	}

	img {
		width: 200px;
	}
</style>
