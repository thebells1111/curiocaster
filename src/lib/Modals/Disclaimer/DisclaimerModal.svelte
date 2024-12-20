<script>
	import Disclaimer from './Disclaimer.svelte';

	import { showDisclaimer } from '$/stores';
</script>

<section class:active={$showDisclaimer} on:click|self={() => ($showDisclaimer = false)}>
	<div class="scroll-bar-clipper">
		<Disclaimer />
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		background-color: hsla(0, 0%, 0%, 0.45);
		height: 100vh;
		width: 100vw;
		color: var(--primary-text-color);
		display: none;
		place-items: center;
		z-index: 9999;
		backdrop-filter: blur(3px);
	}

	.active {
		display: grid;
	}

	.scroll-bar-clipper {
		padding: 8px;
		width: calc(100% - 16px);
		max-width: 850px;
		height: 80%;
		background-color: var(--primary-color);
		color: var(--primary-text-color);
		border-radius: 5px;
		overflow: auto;
		border: var(--modal-border);
		box-shadow: var(--modal-box-shadow);
	}
</style>
