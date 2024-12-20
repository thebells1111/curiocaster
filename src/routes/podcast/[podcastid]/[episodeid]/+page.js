import { remoteServer } from "$/stores";
import checklive from "$functions/checklive.js";

export async function load({ params, fetch }) {
  let podcastId = params.podcastid;
  let episodeId = params.episodeid;
  let initialPodcast;
  let initialEpisode;
  if (podcastId.includes("pi")) {
    let id = podcastId.slice(2);

    if (Number(episodeId)) {
      let urls = [
        `${remoteServer}api/queryindex?q=podcasts/byfeedid?id=` + id,
        `${remoteServer}api/queryindex?q=episodes/byfeedid?` +
          encodeURIComponent(`id=${id}&max=1000`),
        `${remoteServer}api/queryindex?q=episodes/byid?` +
          encodeURIComponent(`id=${episodeId}` + "&fulltext"),
      ];
      let response = await Promise.all(urls.map((url) => fetch(url)));
      let data = await Promise.all(response.map((res) => res.json()));
      if (data[0].status) {
        let podcast = data[0].feed;
        podcast.episodes = data[1].items;
        initialPodcast = podcast;
        initialEpisode = data[2].episode;
      }
    } else if (episodeId === "live") {
      let urls = [
        `${remoteServer}api/queryindex?q=podcasts/byfeedid?id=` + id,
        `${remoteServer}api/queryindex?q=episodes/byfeedid?` +
          encodeURIComponent(`id=${id}&max=1000`),
      ];
      let response = await Promise.all(urls.map((url) => fetch(url)));
      let data = await Promise.all(response.map((res) => res.json()));
      if (data[0].status) {
        let podcast = data[0].feed;
        podcast.episodes = data[1].items;
        initialPodcast = podcast;

        const feed = await checklive(encodeURIComponent(podcast.url));
        initialEpisode = feed.live[0];
      }
    }
  }

  return {
    podcast: initialPodcast,
    episode: initialEpisode,
  };
}
