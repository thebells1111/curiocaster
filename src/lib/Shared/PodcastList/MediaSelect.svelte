<script>
	import { remoteServer, musicList, selectedMediaType } from '$/stores';
	async function getMusic() {
		$selectedMediaType = 'music';
		const res = await fetch(remoteServer + `api/queryindex?q=podcasts/bymedium?medium=music`);
		let data = await res.json();
		$musicList = data.feeds;
		console.log(data);
	}

	function getPodcasts() {
		$selectedMediaType = 'podcast';
	}
</script>

<div class="container">
	<button on:click={getPodcasts}>
		<div class="button-container">
			<div>Podcasts</div>
			<img class:active={$selectedMediaType === 'podcast'} src="/media-underline.webp" />
		</div>
	</button>
	<button on:click={getMusic}>
		<div class="button-container">
			<div>Music</div>
			<img class:active={$selectedMediaType === 'music'} src="/media-underline.webp" />
		</div>
	</button>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
	}

	.button-container {
		width: 100%;
		position: relative;
	}
	button {
		font-family: 'Ruthie', cursive;
		font-size: 1.3em;
		width: 180px;
		background-color: transparent;
		margin: 0;
		border: none;
		position: relative;
	}

	.active {
		display: initial;
	}

	img {
		width: 100%;
		display: none;
		position: absolute;
		left: 0;
		bottom: -6px;
	}
</style>
