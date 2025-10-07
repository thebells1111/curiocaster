import { remoteServer } from "$/stores";

// fetches podcasts and episodes from the podcast index api

export async function fetchPodcast(podcastId) {
  if (podcastId.includes("pi")) {
    return await fetchPodcastById(podcastId.slice(2));
  } else if (Number(podcastId)) {
    return await fetchPodcastById(podcastId);
  } else if (podcastId.length === 36) {
    return await fetchPodcastByGuid(podcastId);
  }
  return null;
}

export async function fetchPodcastById(id) {
  const [podcastData, episodesData] = await Promise.all([
    fetchFeedById(id),
    fetchEpisodesList(id),
  ]);

  if (podcastData.status) {
    const podcast = podcastData.feed;
    podcast.episodes = episodesData.items;
    return podcast;
  }

  return null;
}

export async function fetchPodcastByGuid(guid) {
  const feedData = await fetchFeedByGuid(guid);
  const podcast = feedData.feed;

  const episodesData = await fetchEpisodesList(podcast.id);

  if (episodesData.items) {
    podcast.episodes = episodesData.items;
    return podcast;
  }

  return null;
}

async function fetchFromIndex(endpoint) {
  const response = await fetch(
    `${remoteServer}api/queryindex?q=${encodeURIComponent(endpoint)}`
  );
  return await response.json();
}

export async function fetchFeedById(feedId) {
  return await fetchFromIndex(`podcasts/byfeedid?id=${feedId}`);
}

export async function fetchFeedByGuid(feedGuid) {
  return await fetchFromIndex(`podcasts/byguid?guid=${feedGuid}`);
}

export async function fetchEpisodesList(feedId) {
  return await fetchFromIndex(`episodes/byfeedid?id=${feedId}&max=1000`);
}

export async function fetchEpisode(episodeId) {
  const params = encodeURIComponent(`id=${episodeId}&fulltext`);
  return await fetchFromIndex(`episodes/byid?${params}`);
}