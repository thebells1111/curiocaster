import parseSRT from 'parse-srt';
import findMatchingEpisodeFromFeed from './findMatchingEpisodeFromFeed';

import {
	selectedPlayingList,
	srcStartTime,
	srcStopTime,
	chapterIndex,
	transcriptIndex,
	playingEpisode,
	userState,
	playingPodcast,
	podcastDB,
	player,
	playingEpisodeTranscript,
	playerIsPaused,
	podcastStateDB,
	playingEpisodeState,
	playingPodcastState,
	playerDuration,
	defaultBoostValue,
	defaultStream,
	playingStream,
	playingBoostValue,
	playerSaveTime,
	playerTime,
	episodeIsReady,
	chapterDisplayImage,
	playingEpisodeChapters,
	showFiat,
	remoteServer,
	feedItems
} from '$/stores';

import { get } from 'svelte/store';
import getWalletValueBlock from './getWalletValueBlock';

export default async function loadEpisode(episode, podcast, playingList) {
	console.log(episode);
	console.log(podcast);

	if (typeof episode.podcast === 'number') {
		podcast = await podcastDB.getItem(`${episode.podcast}`);
	}

	if (playingList === 'playlist') {
		let storedPodcast = await podcastDB.getItem(`${episode.podcast.id}`);

		if (storedPodcast) {
			playingPodcast.set(storedPodcast);
		} else {
			let response = await fetch(
				remoteServer + `api/queryindex?q=podcasts/byfeedid?id=` + podcast.id
			);
			let data = await response.json();
			playingPodcast.set(data.feed);
		}
	} else {
		playingPodcast.set(podcast);
	}

	episodeIsReady.set(false);
	chapterDisplayImage.set(undefined);
	getWalletValueBlock(episode, podcast);
	selectedPlayingList.set(playingList);
	srcStartTime.set(undefined);
	srcStopTime.set(undefined);
	chapterIndex.set(0);
	transcriptIndex.set(0);

	userState.update((v) => {
		v.playing.episode = episode;
		return v;
	});

	let id = episode.guid;
	let $userState = get(userState);
	let $player = get(player);

	let storedState = {
		complete: false,
		hide: false,
		time: 0,
		duration: 0
	};

	let $playingPodcastState = (await podcastStateDB.getItem(`${podcast?.id}`)) || {};

	$playingPodcastState[id] = $playingPodcastState?.[id] || storedState;

	$userState.playing.episodeState = get(playingEpisodeState);
	$userState.playing.podcastState = $playingPodcastState;
	$userState.playing.selectedList = get(selectedPlayingList);
	$userState.playing.episodeState.duration = get(playerDuration);
	$userState.playing.episode = episode;

	$userState.playing.podcast = {
		id: podcast?.id,
		title: podcast.title,
		artwork: podcast.artwork,
		url: podcast.url
	};

	console.log($playingPodcastState);

	userState.set($userState);
	playingPodcastState.set($playingPodcastState);
	playingBoostValue.set(
		get(showFiat)
			? get(playingPodcastState)?.usdBoost ?? get(defaultBoostValue)
			: get(playingPodcastState)?.boost ?? get(defaultBoostValue)
	);
	playingStream.set(
		get(showFiat)
			? get(playingPodcastState)?.usdStream ?? get(defaultStream)
			: get(playingPodcastState)?.stream ?? get(defaultStream)
	);
	playingEpisodeState.set($playingPodcastState[id]);
	playerTime.set(get(playingPodcastState)[id].time);
	playerSaveTime.set(0);
	playerDuration.set($player.duration);
	$player.currentTime = get(srcStartTime) || get(playerTime) || 0.0;
	playingEpisode.set(episode);

	if (episode?.chaptersUrl) {
		const res = await fetch(`/api/httpsproxy?url=` + encodeURIComponent(episode?.chaptersUrl));
		const chap = await res.json();
		playingEpisodeChapters.set(chap.chapters);
	} else {
		playingEpisodeChapters.set(undefined);
	}

	const transcriptSRT = episode.transcripts?.find(
		({ type }) =>
			type === 'application/srt' || type === 'text/srt' || type === 'application/x-subrip'
	);

	if (transcriptSRT?.url) {
		let res = await fetch(`/api/httpsproxy?url=` + transcriptSRT.url);
		if (res.status === 200) {
			let text = await res.text();
			let transcript = parseSRT(text);
			let t = transcript
				.map((v) => v.text)
				.join(' ')
				.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ');

			transcript.full = t.split('|-|').join(' ');
			playingEpisodeTranscript.set(transcript);
		} else {
			playingEpisodeTranscript.set(null);
		}
	} else {
		playingEpisodeTranscript.set(null);
	}

	get(player).play();
	playerIsPaused.set(false);
}
