<script>
	import PlayArrow from '$lib/icons/PlayArrow.svelte';
	import MoreVert from '$lib/icons/MoreVert.svelte';
</script>

<div class="container">
	<div class="card">
		<div class="episode-info">
			<div class="head">
				<div class="image-holder" />
				<div class="title-container">
					<div class="date-holder" />
					<div class="title-holder" />
					<div class="title-holder" />
				</div>
			</div>
			<div class="description">
				<div class="text" />
				<div class="text" />
				<div class="text" />
			</div>

			<div class="bottom-control-bar">
				<PlayArrow size="40px" />
				<div class="options-container"><MoreVert size="27px" /></div>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		min-height: 186px;
		margin: 0;
		padding: 4px 8px;
		list-style: none;
		cursor: pointer;
		box-sizing: border-box;
		display: flex;
		position: relative;
		overflow: hidden;
	}

	.card {
		height: 100%;
		width: 100%;
		margin: 0;
		padding: 4px;
		list-style: none;
		cursor: pointer;
		box-sizing: border-box;
		display: flex;
		position: relative;
		overflow: hidden;
		background-color: var(--episode-card-color);
		border-radius: 8px;
	}
	.episode-info {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.head {
		width: 100%;
		flex-grow: 1;
		display: flex;
	}

	.head .image-holder {
		min-width: 60px;
		height: 60px;
		background-color: var(--loading-text-color);
		border-radius: 6px;
		margin-right: 8px;
	}

	.title-container {
		width: 100%;
	}

	.head .title-holder {
		width: 100%;
		height: 18px;
		margin: 0;
		display: inline-block;
		background-color: var(--loading-text-color);
		border-radius: 1em;
	}

	.head .date-holder {
		padding: 0;
		margin-bottom: 4px;
		background-color: var(--loading-text-color);
		height: 1em;
		width: 33%;
		border-radius: 1em;
	}

	.description {
		width: 100%;
		height: 63px;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.description .text {
		height: 14px;
		width: 100%;
		background-color: var(--loading-text-color);
		border-radius: 1em;
	}

	.bottom-control-bar {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: var(--loading-text-color);
	}
	.options-container {
		margin: 0 20px 8px 0;
	}
</style>
