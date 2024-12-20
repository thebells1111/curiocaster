import convertTime from '$functions/convertTime';

import { devMode, playingPodcast, playingEpisode } from '$/stores';

import { get } from 'svelte/store';

export default function createBoostLink(ts) {
	let startArr = convertTime(ts).split(':');
	let startHrs = startArr[0];
	let startMins = startArr[1];
	let startSecs = startArr[2];

	let slug = get(playingPodcast).id + '/' + get(playingEpisode).id;

	let startTime = Number(startHrs) * 3600 + Number(startMins) * 60 + Number(startSecs);

	slug = slug + `#t=${startTime}`;

	let link;
	if (devMode) {
		link = `http://localhost:3000/${slug}`;
	} else {
		link = `https://curiocaster.com/${slug}`;
	}

	return link;
}
