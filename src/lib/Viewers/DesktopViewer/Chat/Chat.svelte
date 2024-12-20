<script>
	import { playingEpisode } from '$/stores';
	import WalletControls from '$lib/Shared/NowPlaying/WalletControls.svelte';
</script>

<div class="container">
	<iframe src={$playingEpisode.chat} />

	<WalletControls />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		height: calc(100% - 10px);
	}
	iframe {
		width: 100%;
		height: calc(100% - 70px);
		border: none;
		background-color: white;
	}
</style>
