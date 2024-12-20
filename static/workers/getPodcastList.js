importScripts('helpers/localforage.js');

const podcastDB = localforage.createInstance({
  name: 'podcastDB',
});

self.onmessage = getPodcastList();

async function getPodcastList(event) {
  const keys = await podcastDB.keys();
  let promises = keys.map((key) => podcastDB.getItem(key));
  let podcasts = await Promise.all(promises);

  postMessage(podcasts);
}
