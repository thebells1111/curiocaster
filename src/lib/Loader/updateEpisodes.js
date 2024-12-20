import sortEpisodes from '$functions/sortEpisodes';

import {
	selectedPodcast,
	episodesList,
	filteredEpisodesList,
	mainPodcastList,
	podcastList,
	isUpdatingEpisodes,
	remoteServer,
	recentEpisodes,
	newEpisodesFlag,
	showRecentEpisodes,
	newestEpisodes,
	episodeSorter,
	recentSettings,
	podcastDB
} from '$/stores';

import { get } from 'svelte/store';

export default async function updateEpisodes(initial) {
	let list = get(mainPodcastList);
	if (!list?.length || get(isUpdatingEpisodes)) {
		return;
	}
	isUpdatingEpisodes.set(true);
	const w = new Worker('/workers/updateepisodes.js');
	w.postMessage({
		remoteServer: remoteServer,
		initial: initial,
		recentSettings: get(recentSettings)
	});
	w.onmessage = async function (event) {
		if (event.data.newest) {
			newestEpisodes.set(event.data.newest);
			newEpisodesFlag.set(true);
		}
		if (event.data.feed) {
			let feed = event.data.feed;
			await podcastDB.setItem(`${feed.id}`, feed);
		}
		if (event.data.recent) {
			let recent = event.data.recent;
			recentEpisodes.set(recent);
			if (!get(showRecentEpisodes)) {
				if (get(selectedPodcast)?.episodes) {
					episodesList.set(get(selectedPodcast)?.episodes);
					filteredEpisodesList.set(sortEpisodes(get(episodesList), get(episodeSorter)));
				}
			} else {
				episodesList.set(get(recentEpisodes));
				filteredEpisodesList.set(sortEpisodes(get(episodesList), get(episodeSorter)));
			}
		}
		if (event.data.podcasts) {
			let podcasts = event.data.podcasts;
			let filtered = podcasts
				.filter((v) => v.hasOwnProperty('id'))
				.sort((a, b) => {
					return a.title.localeCompare(b.title);
				});
			mainPodcastList.set(filtered);
			podcastList.set(filtered);
		}
		if (event.data.terminate) {
			w.terminate();
			isUpdatingEpisodes.set(false);
		}
	};
}
