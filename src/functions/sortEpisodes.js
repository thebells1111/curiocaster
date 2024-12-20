import { selectedPodcastState } from '$/stores';
import { get } from 'svelte/store';

export default function sortEpisodes(list, sorter) {
	const podcastState = get(selectedPodcastState);
	let newList = [];
	if (list?.length > 0) {
		newList = [...list];
		if (get(selectedPodcastState).filterCompletedEpisodes) {
			newList = newList.filter((episode) => {
				let show = !podcastState[episode.guid]?.complete;
				return show;
			});
		}
		newList = newList.sort((a, b) => {
			if (sorter === 'newest') {
				return a.datePublished < b.datePublished ? 1 : -1;
			} else if (sorter === 'oldest') {
				return a.datePublished > b.datePublished ? 1 : -1;
			}
		});
	}

	return newList;
}
