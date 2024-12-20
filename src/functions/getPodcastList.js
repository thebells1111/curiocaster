import { mainPodcastList, podcastList } from '$/stores';

import { get } from 'svelte/store';

export default async function getPodcastList() {
	const w = new Worker('/workers/getPodcastList.js');
	w.postMessage(true);
	w.onmessage = function (event) {
		if (event.data) {
			mainPodcastList.set(
				event.data
					.filter((v) => v.id)
					.sort((a, b) => {
						return a.title.localeCompare(b.title);
					})
			);
			podcastList.set([...get(mainPodcastList)]);
			w.terminate();
		}
	};
}
