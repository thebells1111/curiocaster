<script>
	import NowPlaying from '$lib/Shared/NowPlaying/NowPlaying.svelte';

	import CancelFilled from '$lib/icons/CancelFilled.svelte';
	import ControlButtons from '$lib/Shared/NowPlaying/ControlButtons/ControlButtons.svelte';

	import ShowNotes from '../MainScreen/ShowNotes/ShowNotesModal.svelte';

	import { episodesListPane, showSubscriptionShowNotes } from '$/stores';
</script>

<div class="container">
	<ControlButtons />
	<NowPlaying />
	<div class="show-notes">
		<ShowNotes nowPlaying={true} />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		margin: 0 auto;
		position: relative;
		overflow: hidden;
	}

	.show-notes {
		width: 0px;
	}
</style>
