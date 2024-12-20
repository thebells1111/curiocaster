<script>
	import { selectedPodcast, mainPodcastList } from '$/stores';
	import Image from '$functions/Image.svelte';
	import Subscribe from '$lib/Shared/EpisodeList/Header/Subscribe.svelte';

	let description;
	let descriptionContainer;
	let expandArrow;

	function checkExpand() {
		if (description.clientHeight > 65) {
			descriptionContainer.style.backgroundColor = 'black';
			descriptionContainer.style.cursor = 'pointer';
			expandArrow.style.opacity = '100%';
		}
		// descriptionContainer.style.height = description.clientHeight + 'px';
	}

	function clearExpand() {
		if (description.clientHeight > 65) {
			descriptionContainer.style.backgroundColor = 'transparent';
			descriptionContainer.style.cursor = 'initial';
			expandArrow.style.opacity = '0';
		}
	}
</script>

<div class="container">
	{#if $selectedPodcast.title}
		<div class="card-overflow">
			<div class="card">
				<div class="logo">
					<Image
						src={$selectedPodcast.artwork}
						alt={$selectedPodcast.title}
						style={`width: 300px; height: 300px;	border-radius: 8px;`}
					/>
				</div>
				<div class="titles">
					<div class="titles-top">
						<h2>{$selectedPodcast.title}</h2>
					</div>
					<div
						bind:this={descriptionContainer}
						class="description-container"
						on:mouseenter={checkExpand}
						on:mouseleave={clearExpand}
					>
						<p class="description" bind:this={description}>{$selectedPodcast.description}</p>
					</div>
					<div class="expand-arrow" bind:this={expandArrow}>down</div>
				</div>

				<div class="subscribe">
					{#if $mainPodcastList.findIndex(({ id }) => id === $selectedPodcast?.id) === -1}
						<Subscribe />
					{/if}
				</div>

				{#if $selectedPodcast?.funding?.url}
					<div class="value">
						<a href={$selectedPodcast.funding.url}>Do you value this show? Give value back.</a>
					</div>
				{/if}

				<div class="disclaimer-container">
					<p class="disclaimer">
						<span
							>CurioCaster is a free speech platform that allows you to listen to and support the
							contents found in the {$selectedPodcast.title}'s</span
						>
						<a href={$selectedPodcast?.url}>RSS feed{$selectedPodcast.ownerName ? ',' : '.'}</a>
						<span>
							{#if $selectedPodcast.ownerName}which is owned and served by {$selectedPodcast.ownerName}.{/if}
						</span>
					</p>
					<p class="visit">
						<span>Visit </span><a href={$selectedPodcast?.link}>{$selectedPodcast.title}'s</a><span>
							website here.</span
						>
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		width: 400px;
		height: 100%;
		background-color: var(--background-color);
		display: flex;
		place-content: center;
	}

	.card-overflow {
		height: 100%;
		width: 400px;
		overflow: auto;
		overflow-x: hidden;
		width: 100%;
		background-color: var(--podcast-data-card-color);
	}

	.card {
		width: 392px;
		background-color: var(--podcast-data-card-color);
		padding: 8px;
		display: flex;
		flex-direction: column;
		min-height: 100%;
		position: relative;
	}

	.logo {
		display: grid;
		place-content: center;
		filter: drop-shadow(0px 0px 4px #000);
	}
	.titles {
		margin: 4px 12px 0px 8px;
		position: relative;
	}
	.description,
	.titles-top > h2 {
		margin: 0;
		text-align: right;
		overflow: hidden;
		color: white;
		padding: 0;
		text-shadow: 0px 0px 4px #000;
	}

	.titles-top > h2 {
		margin: 0 0 4px 0;
	}

	.episode-sorter {
		position: absolute;
		right: -30px;
		top: -2px;
		display: grid;
		place-content: center;
	}

	.description-container {
		overflow: hidden;
		border-radius: 6px 6px 0 0;
	}

	.expand-arrow {
		color: white;
		position: absolute;
		opacity: 0;
		background-color: black;
		width: 100%;
		display: grid;
		place-content: center;
		border-radius: 0 0 6px 6px;
	}

	.description {
		height: 65px;
		margin: 0;
		font-size: 1em;
		opacity: 90%;
	}

	.expand {
		cursor: pointer;
	}

	.subscribe {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 8px;
		flex-grow: 1;
	}

	.disclaimer-container {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-right: 8px;
	}
	.disclaimer-container > p {
		font-size: 0.9em;
		font-style: italic;
		margin: 0;
		line-height: 1em;
		text-align: right;
	}

	.disclaimer-container > p > span {
		color: white;
		opacity: 75%;
	}

	.disclaimer-container a {
		color: white;
		opacity: 75%;
	}

	.disclaimer-container a:hover {
		color: white;
		opacity: 100%;
	}

	.visit > a {
		margin-right: 3px;
	}

	.value {
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		padding: 4px;
		border-radius: 20px;
		margin-bottom: 8px;
		opacity: 95%;
		background-color: #0186f1;
		background: linear-gradient(#0186f1, #00447c);
		box-shadow: rgb(255 255 255 / 0%) 0px 1px 1px inset;
	}

	.value > a {
		text-decoration: none;
		color: rgb(250, 250, 250);
	}
</style>
