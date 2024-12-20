<script>
	import Export from './Export.svelte';
	import Import from './ImportModal.svelte';
	import OPML from './OPML.svelte';

	import { showOPML } from '$/stores';

	let showImport = false;
</script>

<section class:active={$showOPML} on:click|self={() => ($showOPML = false)}>
	<div class="scroll-bar-clipper">
		<OPML bind:showImport />
	</div>
</section>

<Import bind:showImport />

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
		z-index: 999;
		backdrop-filter: blur(3px);
	}

	.active {
		display: grid;
	}

	.scroll-bar-clipper {
		width: 320px;
		min-height: 160px;
		height: auto;
		background-color: hsla(0, 0%, 0%, 0.05);
		color: var(--primary-text-color);
		border-radius: 5px;
		overflow: auto;
		display: flex;
		justify-content: space-around;
		align-items: center;
		backdrop-filter: blur(3px);
	}
</style>
