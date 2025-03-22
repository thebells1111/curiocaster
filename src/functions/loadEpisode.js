import findMatchingEpisodeFromFeed from "./findMatchingEpisodeFromFeed";
import getTranscript from './getTranscript';

import clone from "just-clone";

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
  remoteServer,
  splitbox,
  playingSplitbox,
} from "$/stores";

import { get } from "svelte/store";
import getWalletValueBlock from "./getWalletValueBlock";

export default async function loadEpisode(episode, podcast, playingList) {
  if (typeof episode.podcast === "number") {
    podcast = await podcastDB.getItem(`${episode.podcast}`);
  }

  playingPodcast.set(podcast);
  playingSplitbox.set(clone(get(splitbox)));

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
    duration: 0,
  };

  let $playingPodcastState =
    (await podcastStateDB.getItem(`${podcast?.id}`)) || {};

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
    url: podcast.url,
  };

  console.log($playingPodcastState);

  userState.set($userState);
  playingPodcastState.set($playingPodcastState);
  playingBoostValue.set(
    get(playingPodcastState)?.boost ?? get(defaultBoostValue)
  );
  playingStream.set(get(playingPodcastState)?.stream ?? get(defaultStream));
  playingEpisodeState.set($playingPodcastState[id]);
  playerTime.set(get(playingPodcastState)[id].time);
  playerSaveTime.set(0);
  playerDuration.set($player.duration);
  $player.currentTime = get(srcStartTime) || get(playerTime) || 0.0;
  playingEpisode.set(episode);

  if (episode?.chaptersUrl) {
    const res = await fetch(
      `/api/httpsproxy?url=` + encodeURIComponent(episode?.chaptersUrl)
    );
    const chap = await res.json();
    playingEpisodeChapters.set(chap.chapters);
  } else {
    playingEpisodeChapters.set(undefined);
  }

  const transcript = await getTranscript(episode?.transcripts);
  playingEpisodeTranscript.set(transcript);

  get(player).play();
  playerIsPaused.set(false);
}
