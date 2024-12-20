import { remoteServer } from "$/stores";

export async function load({ url, fetch }) {
  let podcastId = url.searchParams.get("podcast");
  let episodeId = url.searchParams.get("episode");

  console.log(podcastId);
  let initialPodcast;
  let initialEpisode;
  if (Number(episodeId) && Number(podcastId)) {
    console.log("cool");
    let urls = [
      `${remoteServer}api/queryindex?q=podcasts/byfeedid?id=` + podcastId,
      `${remoteServer}api/queryindex?q=episodes/byfeedid?` +
        encodeURIComponent(`id=${podcastId}&max=1000`),
    ];
    let response = await Promise.all(urls.map((url) => fetch(url)));
    let data = await Promise.all(response.map((res) => res.json()));
    if (data[0].status) {
      let podcast = data[0].feed;
      podcast.episodes = data[1].items;
      initialPodcast = podcast;
      initialEpisode = podcast.episodes.find(
        ({ id }) => Number(id) === Number(episodeId)
      );
    }
  }

  return {
    podcast: initialPodcast,
    episode: initialEpisode,
  };
}
