<script>
	import { parse } from 'fast-xml-parser';

	const parserOptions = {
		attributeNamePrefix: '@_',
		ignoreAttributes: false,
		ignoreNameSpace: false
	};

	import {
		mainPodcastList,
		podcastList,
		podcastDB,
		remoteServer,
		recentEpisodes,
		recentSettings,
		selectedPodcastState,
		podcastStateDB
	} from '$/stores';

	let notadded = [];
	let max = 0;
	let progress = 0;
	let importStatus = '';

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

				let xmlJson = parse(data, parserOptions);

				let items = xmlJson.opml.body.outline;

				console.log(items);

				max = items.length;
				if (max > 0) {
					importStatus = 'importing';
				}
				items.forEach(async (item) => {
					let urls = [
						remoteServer +
							`api/queryindex?q=podcasts/byfeedurl?url=` +
							encodeURIComponent(item['@_xmlUrl']),
						remoteServer +
							`api/queryindex?q=episodes/byfeedurl?` +
							encodeURIComponent(`url=${item['@_xmlUrl']}&max=1000`)
					];
					Promise.all(urls.map((url) => fetch(url).then((response) => response.json())))
						.then(async (data) => {
							if (data[0].status) {
								let podcast = data[0].feed;
								podcast.episodes = data[1].items;
								await podcastDB.setItem(`${podcast.id}`, podcast);
							} else {
								notadded.push(item.title);
								notadded = notadded;
							}
							updateProgress();
						})
						.catch((err) => {
							notadded.push(item.title);
							notadded = notadded;
							updateProgress();
						});
				});
			};
		});
	}

	async function updateProgress() {
		progress++;
		if (progress === max) {
			max = 0;
			importStatus = 'complete';
			notadded = notadded;
			try {
				const keys = await podcastDB.keys();
				let promises = keys.map((key) => podcastDB.getItem(key));
				let podcasts = await Promise.all(promises);
				podcasts = podcasts.filter((v) => v.hasOwnProperty('title'));

				$mainPodcastList = podcasts.sort((a, b) => (a.title > b.title ? 1 : -1));
				$podcastList = [...$mainPodcastList];

				let recentList = (await podcastStateDB.getItem('recent')) || {};
				for (let podcast of podcasts) {
					let recent = [];
					podcast.episodes.forEach((v) => {
						if (
							v.datePublished >
							Math.floor(new Date().getTime() / 1000) - ($recentSettings?.time || 604800)
						) {
							v.podcast = podcast.id;
							recent.push(v);
						}
					});

					recent = recent.slice(0, $recentSettings?.maxEps || 3);
					$recentEpisodes = $recentEpisodes || [];
					$recentEpisodes = $recentEpisodes.concat(recent).sort((a, b) => {
						return a.datePublished > b.datePublished ? -1 : 1;
					});

					let state = (await podcastStateDB.setItem(`${podcast.id}`)) || {
						filterCompletedEpisodes: true
					};
					await podcastDB.setItem('recent', $recentEpisodes);
					$selectedPodcastState = state;
					await podcastStateDB.setItem(`${podcast.id}`, state);
				}
			} catch (err) {
				console.log(err);
			}
		}
	}
</script>

<div class="results-container">
	<h2>Import OPML File</h2>
	<input type="file" id="input" on:change={handleInput} />

	{#if notadded.length > 0}
		<h4>
			The following feeds were not able to be added. Do a search for the feed to see if you can add
			it manually.
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
</div>

<style>
	.results-container {
		width: 100%;
		height: 100%;
		color: var(--primary-text-color);
		background: linear-gradient(var(--shownotes-color-light), var(--shownotes-color-dark));
		overflow: auto;
		display: flex;
		flex-direction: column;
		padding: 8px;
	}

	input {
		width: 100%;
	}
	h2 {
		text-align: center;
		margin: 0 0 8px 0;
	}
</style>
