<script>
	import Export from './Export.svelte';

	import { showOPML, showMobile, modalSwiperType } from '$/stores';

	export let showImport = false;

	function handleImport() {
		if ($showMobile) {
			$modalSwiperType = 'importOpml';
		} else {
			showImport = true;
			$showOPML = false;
		}
	}
</script>

<Export />
<button class="primary" on:click={handleImport}>Import OPML</button>

<style>
</style>
