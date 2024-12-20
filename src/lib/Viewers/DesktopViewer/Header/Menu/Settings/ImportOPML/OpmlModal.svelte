<script>
	import Upload from '../$lib/icons/Upload.svelte';

	import { mainPodcastList, podcastList, podcastDB, windowHeight } from '$/stores';
	export let showOpmlModal;
	let notadded = [];
	let max = 0;
	let progress = 0;
	let importStatus = '';

	function hideModal() {
		showOpmlModal = false;
	}

	function handleInput(e) {
		e.preventDefault();
		let files = e.target.files || e.dataTransfer.files;
		if (files.length == 0) return;
		[...files].forEach((file, i, a) => {
			let reader = new FileReader();
			reader.readAsBinaryString(file);
			reader.onload = async function (e) {
				//Handle the load event. Triggered when the read operation completes.
				let data = e.target.result;
				const res = await fetch(`/api/parseopml`, {
					method: 'POST',
					body: { opml: data },
					headers: { 'Content-type': 'application/json; charset=UTF-8' },
					credentials: 'same-origin'
				});
				let docs = await res.json();
				max = docs.length;
				if (max > 0) {
					importStatus = 'importing';
				}
				docs.forEach(async (doc) => {
					const podcastRes = await fetch(
						`/api/getpodcast.js?url=${encodeURIComponent(doc.feedUrl)}`,
						{
							credentials: 'same-origin'
						}
					);
					let podcastData = await podcastRes.json();

					if (podcastData.status === 'true') {
						let podcast = podcastData.feed;

						const episodeRes = await fetch(
							`/api/getepisodes?url=${encodeURIComponent(podcast.url)}`,
							{
								credentials: 'same-origin'
							}
						);
						const episodesData = await episodeRes.json();
						podcast.episodes = episodesData.episodes;

						await podcastDB.setItem(`${podcast.id}`, podcast);
					} else {
						notadded.push(doc.title);
						notadded = notadded;
					}
					progress++;
					if (progress === max) {
						max = 0;
						importStatus = 'complete';
						notadded = notadded;
						try {
							const keys = await podcastDB.keys();
							let promises = keys.map((key) => podcastDB.getItem(key));
							let podcasts = await Promise.all(promises);
							$mainPodcastList = podcasts.sort((a, b) => (a.title > b.title ? 1 : -1));
							$podcastList = [...$mainPodcastList];
						} catch (err) {
							// This code runs if there were any errors.
							console.log(err);
						}
					}
				});
			};
		});
	}
</script>

<div
	on:click|self={hideModal}
	class="opml-modal"
	on:drop={handleInput}
	on:dragover|preventDefault={(e) => (e.dataTransfer.dropEffect = 'copy')}
>
	<div class="scroll-bar-clipper">
		<div class="results-container">
			<input type="file" id="input" on:change={handleInput} />

			{#if notadded.length > 0}
				<h4>
					The following feeds were not able to be added. Do a search for the feed to see if you can
					add it manually.
				</h4>
				<ul>
					{#each notadded as episode}
						<li>{episode}</li>
					{/each}
				</ul>
			{/if}

			{#if importStatus}
				{#if max > 0}
					<p>Importing feeds: {progress} of {max}</p>
				{:else}
					<p>Import Complete!</p>
				{/if}
			{/if}

			<div class="upload-container">
				<div>
					<Upload size={'256px'} />
					<p>Drag OPML File Here to Upload</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.opml-modal {
		position: fixed;
		top: 0;
		left: 0;
		background-color: hsla(0, 0%, 0%, 0.65);
		width: 100%;
		color: #ddd;
		display: grid;
		place-items: center;
		z-index: 9999;
	}

	.scroll-bar-clipper {
		width: calc(100% - 100px);
		height: calc(100% - 100px);
		background-color: #eee;
		color: #333;
		border-radius: 5px;
		overflow: auto;
	}

	.results-container {
		width: 100%;
		height: 100%;
		background-color: #eee;
		color: #333;
		overflow: auto;
		display: flex;
		flex-direction: column;
	}

	.upload-container {
		display: grid;
		place-items: center;
		flex-grow: 1;
	}

	input {
		width: 100%;
	}
</style>
