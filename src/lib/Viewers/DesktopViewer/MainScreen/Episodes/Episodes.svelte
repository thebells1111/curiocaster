<script>
	import Header from './Header.svelte';
	import EpisodeList from './EpisodeList.svelte';

	let listHeight = 500;
	let headerHeight = 40;
	let sectionHeight;
	let sectionWidth;
	$: if (sectionHeight) {
		listHeight = sectionHeight - headerHeight + 50;
	}
</script>

<Header />
<div class="episodes-container" class:hide={false} style={`height: calc(100% - ${headerHeight}px)`}>
	<EpisodeList bind:listHeight bind:sectionWidth fromSubscriptions={true} />
</div>
