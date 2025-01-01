import { parse } from "fast-xml-parser";
import { decode } from "html-entities";
import {
  liveEpisodes,
  pendingEpisodes,
  feedItems,
  remoteServer,
} from "$/stores";

export default async function getRSSEditorFeed(url) {
  return new Promise(async (resolve, reject) => {
    const feed = await getFeed(encodeURIComponent(url));
    console.log(feed);

    liveEpisodes.set(feed.live || []);

    pendingEpisodes.set(feed.pending || []);

    feedItems.set(feed.item || []);

    resolve(feed);
  });
}

const getFeed = async (url) => {
  try {
    const response = await fetch(remoteServer + "api/proxy?url=" + url, {
      "User-Agent": "CurioCaster",
    });
    const feed = (await response.text()) || {};

    const parserOptions = {
      attributeNamePrefix: "@_",
      ignoreAttributes: false,
      ignoreNameSpace: false,
      attrValueProcessor: (val, attrName) => decode(val), //default is a=>a
      tagValueProcessor: (val, tagName) => decode(val), //default is a=>a
    };

    let xmlJson = parse(feed, parserOptions);

    let liveItem = [].concat(xmlJson?.rss?.channel?.["podcast:liveItem"]);
    let item = [].concat(xmlJson?.rss?.channel?.item);

    let live = liveItem
      .filter((v) => v && v["@_status"].toLowerCase() === "live")
      .map((v) => {
        console.log(v);
        return {
          description: v.description || "",
          enclosureType: v.enclosure["@_type"],
          enclosureUrl: v.enclosure["@_url"],
          explicit: null,
          guid: v.guid,
          image: v?.["itunes:image"]?.["@_href"],
          title: v.title,
          persons: null,
          value: parseValue(v["podcast:value"]),
          liveStatus: v["@_status"].toLowerCase(),
          chat: parseChat(v),
          startTime: v["@_start"],
          liveValueLink: v?.["podcast:liveValue"]?.["@_uri"],
        };
      });

    let pending = liveItem
      .filter((v) => v && v["@_status"].toLowerCase() === "pending")
      .map((v) => {
        return {
          description: v.description || "",
          enclosureType: v.enclosure["@_type"],
          enclosureUrl: v.enclosure["@_url"],
          explicit: null,
          guid: v.guid,
          image: v.image,
          title: v.title,
          persons: null,
          value:
            parseValue(v["podcast:value"]) ||
            parseValue(feed?.rss?.channel?.["podcast:value"]),
          liveStatus: v["@_status"].toLowerCase(),
          chat: parseChat(v),
          startTime: v["@_start"],
        };
      });

    let channel = xmlJson?.rss?.channel;
    delete channel.item;

    return { channel, live, pending, item };
  } catch (err) {
    console.log("getepisodes.js Error:", err);
    return {};
  }
};

function parseValue(v) {
  console.log(v);
  if (v) {
    let value = {
      model: {
        method: v["@_method"],
        suggested: v["@_suggested"],
        type: v["@_type"],
      },
    };
    let destinations = [].concat(v["podcast:valueRecipient"]).map((w) => {
      console.log(w);
      return {
        address: w["@_address"],
        customKey: w["@_customKey"],
        customValue: w["@_customValue"],
        name: w["@_name"],
        split: w["@_split"],
        type: w["@_type"],
      };
    });

    value.destinations = destinations;
    return value;
  }
  return undefined;
}

function parseChat(v) {
  return v?.["podcast:chat"]?.["@_embedUrl"] || v["@_chat"];
}
