<script>
	import WalletInfo from './WalletInfo.svelte';
	export let showWalletInfo = false;
</script>

<section
	class:active={showWalletInfo}
	on:mousedown|self={() => (showWalletInfo = false)}
	on:touchstart|self={() => (showWalletInfo = false)}
>
	<div class="scroll-bar-clipper">
		<WalletInfo />
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		color: var(--primary-text-color);
		display: none;
		place-items: center;
		z-index: 10;
	}

	.active {
		display: grid;
	}

	.scroll-bar-clipper {
		width: calc(100% - 16px);
		max-width: 360px;
		height: calc(100% - 80px);
		max-height: 700px;
		padding: 16px;
		background-color: var(--primary-color);
		color: var(--primary-text-color);
		border-radius: 5px;
		overflow: auto;
		display: flex;
		flex-direction: column;
		position: absolute;
		border: var(--modal-border);
		box-shadow: var(--modal-box-shadow);
	}
</style>
