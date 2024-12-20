export default function findMatchingEpisodeFromFeed(array, object) {
  for (let item of array) {
    if (
      item?.guid &&
      item?.guid?.["#text"] &&
      (item.guid["#text"] === object?.guid ||
        item.guid["#text"] === object?.guid?.["#text"])
    ) {
      return item;
    }
    if (
      item?.enclosure &&
      item?.enclosure?.["@_url"] &&
      item.enclosure["@_url"] === object?.enclosureUrl
    ) {
      return item;
    }
  }
  return null;
}
