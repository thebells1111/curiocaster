<script>
	import {
		podcastList,
		mainPodcastList,
		selectedPodcast,
		podcastDB,
		podcastStateDB,
		recentEpisodes,
		recentSettings,
		podcastListPane,
		selectedPodcastState
	} from '$/stores';

	async function subscribe(evt, podcast) {
		if (!evt.target.className.includes('is-subscribed')) {
			evt.target.classList.add('is-subscribed');
			evt.target.innerText = 'Subscribed';

			setTimeout(() => {
				evt.target.style.display = 'none';
				// $podcastListPane = 'subscriptions';
			}, 1000);

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

			await podcastDB.setItem(`${podcast.id}`, podcast);
			podcastStateDB.setItem(`${podcast.id}`, { filterCompletedEpisodes: true });
			$selectedPodcastState = { filterCompletedEpisodes: true };

			try {
				$mainPodcastList.unshift(podcast);
				$mainPodcastList = $mainPodcastList;

				$podcastList = [...$mainPodcastList];
			} catch (err) {
				// This code runs if there were any errors.
				console.log(err);
			}
		}
	}
</script>

<button
	class="primary subscribe"
	class:is-subscribed={$mainPodcastList.findIndex(({ id }) => id === $selectedPodcast?.id) > -1}
	on:click={(evt) => subscribe(evt, $selectedPodcast)}
>
	Subscribe
</button>

<style>
	button:hover {
		background-color: black;
		color: white;
	}

	button:active {
		background-color: #333;
		color: #eee;
	}

	.is-subscribed,
	.is-subscribed:hover,
	.is-subscribed:active {
		background-color: transparent;
		border: 1px solid #ddd;
		cursor: default;
	}
</style>
