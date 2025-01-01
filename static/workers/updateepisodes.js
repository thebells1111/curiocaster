importScripts("helpers/localforage.js");

const podcastDB = localforage.createInstance({
  name: "podcastDB",
});

const podcastStateDB = localforage.createInstance({
  name: "podcastStateDB",
});

self.onmessage = processPodcast;

async function processPodcast(event) {
  // console.log(event.data);
  let remoteServer = event.data.remoteServer;
  let recentSettings = event.data.recentSettings;
  let newestEpisodes = event.data.newestEpisodes || {};
  let initial = event.data.initial;
  let promises = [];
  let recent = [];

  const keys = await podcastDB.keys();

  for (const key of keys) {
    if (key && key !== "recent" && key !== "undefined") {
      promises.push(getEpisodes(key));
    }
  }

  let podcasts = await Promise.all(promises);

  recent = recent.sort((a, b) => {
    return a.datePublished > b.datePublished ? -1 : 1;
  });

  await podcastDB.setItem("recent", recent);
  await podcastDB.removeItem("undefined");

  let state = await podcastStateDB.getItem("recent");
  let newState = {
    filterCompletedEpisodes: state?.hasOwnProperty("filterCompletedEpisodes")
      ? state.filterCompletedEpisodes
      : true,
  };
  recent.forEach(({ guid }) => {
    if (state.hasOwnProperty(guid)) {
      newState[guid] = state[guid];
    }
  });

  await podcastStateDB.setItem("recent", newState);

  postMessage({ podcasts: podcasts });
  postMessage({ recent: recent });
  if (Object.keys(newestEpisodes).length) {
    postMessage({ newest: newestEpisodes });
  }
  postMessage({ terminate: true });

  async function getEpisodes(key) {
    try {
      let podcast = await podcastDB.getItem(key);
      let feed = {};

      if (!podcast?.episodes?.[0]?.guid) {
        podcast.lastUpdateTime = undefined;
      }

      let episodeQuery =
        `${remoteServer}api/queryindex?q=episodes/byfeedid?` +
        encodeURIComponent(
          `id=${podcast.id}&max=1000&since=${
            initial ? 1 : podcast.lastUpdateTime
          }`
        );

      let urls = [
        `${remoteServer}api/queryindex?q=podcasts/byfeedid?id=` + podcast.id,
        episodeQuery,
      ];

      let feeds = urls.map((url) =>
        fetch(url).then((response) => response.json())
      );
      let data = await Promise.all([...feeds]);

      let [channel, episodes] = data;

      if (channel.status) {
        feed = channel.feed;
        let newEpisodes = [];
        let allEpisodes = [];
        let recentEpisodes = [];
        let episodeObject = {};
        let uniqueEpisodes = [];

        if (!podcast?.episodes?.[0]?.guid) {
          podcast.episodes = [];
        }

        if (initial) {
          newEpisodes = episodes.items.filter(
            (newEp) =>
              podcast.episodes.findIndex(({ guid }) => newEp.guid === guid) ===
              -1
          );
          allEpisodes = episodes.items;
        } else {
          newEpisodes = episodes.items;
          allEpisodes = newEpisodes.concat(podcast.episodes);
        }

        allEpisodes.forEach((v) => {
          if (!episodeObject[v.guid]) {
            v.image = v.image || podcast.artwork;
            v.podcast = podcast.id;
            v.feedTitle = podcast.title;
            if (
              v.datePublished >
              Math.floor(new Date().getTime() / 1000) -
                (recentSettings?.time * 86400 || 604800)
            ) {
              recentEpisodes.push(v);
            }
            episodeObject[v.guid] = v;
          }
        });

        for (let episode in episodeObject) {
          uniqueEpisodes.push(episodeObject[episode]);
        }

        uniqueEpisodes.splice(Math.min(1000, uniqueEpisodes.length));

        feed.episodes = uniqueEpisodes;

        recent = recent.concat(
          recentEpisodes.slice(0, recentSettings?.maxEps || 3)
        );

        let newEps = newEpisodes.map((v) => v.guid);

        if (newEps.length) {
          newEps.forEach((item) => {
            let id = Number(podcast.id);
            newestEpisodes[id] = newestEpisodes[id] || new Set();
            newestEpisodes[id].add(item);
          });
        }

        postMessage({ feed: feed });
      }

      podcast = feed;

      return podcast;
    } catch (err) {
      console.log(err);
    }
  }
}
