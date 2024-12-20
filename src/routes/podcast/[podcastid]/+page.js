import { remoteServer } from "$/stores";

export async function load({ params, fetch }) {
  let podcastId = params.podcastid;
  let urls;
  let initialPodcast;
  if (podcastId.includes("pi")) {
    let id = podcastId.slice(2);
    urls = [
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
    }
  } else if (podcastId.length === 36) {
    let guid = podcastId;

    const res = await fetch(
      remoteServer + `api/queryindex?q=podcasts/byguid?guid=${guid}`,
      {
        credentials: "same-origin",
      }
    );
    let data = await res.json();
    let podcast = data.feed;

    const epRes = await fetch(
      `${remoteServer}api/queryindex?q=episodes/byfeedid?` +
        encodeURIComponent(`id=${podcast.id}&max=1000`),
      {
        credentials: "same-origin",
      }
    );
    let docs = await epRes.json();
    if (docs.items) {
      podcast.episodes = docs.items;
      initialPodcast = podcast;
    }
  }

  return {
    podcast: initialPodcast,
  };
}
