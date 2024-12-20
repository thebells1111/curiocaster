<script>
	import PendingEpisodes from './PendingEpisode.svelte';
</script>

<div class="container">
	<div class="episodes">
		<PendingEpisodes />
	</div>
</div>

<style>
	.container {
		height: 100%;
		width: 100%;
		background: transparent;
	}

	.episodes {
		height: calc(100% - 32px);
		margin-top: 32px;
		background-color: red;
		border-radius: 8px 8px 0 0;
		background: linear-gradient(var(--shownotes-color-light), var(--shownotes-color-dark));
		box-shadow: 0px 0px 10px -3px rgb(0 0 0);
	}
</style>
