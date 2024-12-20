import {
  userState,
  playingPodcast,
  playingEpisode,
  pendingEpisodeData,
  pendingEpisodesWallet,
  selectedPodcast,
  playerTime,
  anonBoost,
  nickName,
  walletValueBlock,
  boostBacks,
} from "$/stores";
import { get } from "svelte/store";
// import { encrypt } from './apiFunctions/ciphers';

export default function getBaseRecord({ action, amount, pending }) {
  if (typeof window === "undefined") {
    // Handle server-side scenario or throw an error
    return;
  }

  const $userState = get(userState);
  const $playingPodcast = get(playingPodcast);
  const $playingEpisode = get(playingEpisode);
  const $playerTime = get(playerTime);
  const $anonBoost = get(anonBoost);
  const $nickName = get(nickName);
  const $boostBacks = get(boostBacks);
  const $walletValueBlock = get(walletValueBlock);
  const $pendingEpisodeData = get(pendingEpisodeData);
  const $pendingEpisodesWallet = get(pendingEpisodesWallet);
  const $selectedPodcast = get(selectedPodcast);

  let baseRecord = {
    7629169: {
      guid: $playingPodcast.podcastGuid,
      podcast: $playingPodcast?.title,
      feedID: $playingPodcast?.id,
      episode: $playingEpisode?.title,
      itemID: $playingEpisode?.id,
      episode_guid: $playingEpisode?.guid?.["#text"]
        ? $playingEpisode?.guid?.["#text"]
        : $playingEpisode?.guid,
      ts: Math.floor($playerTime) || 0,
      speed: `${$userState?.playbackSpeed || 1}`,
      action: action,
      app_name: "CurioCaster",
      value_msat_total: amount * 1000,
      url: $playingPodcast?.url,
    },
  };

  if ($pendingEpisodesWallet) {
    baseRecord = {
      7629169: {
        guid: $selectedPodcast.podcastGuid,
        podcast:
          $pendingEpisodeData.title.length < 101
            ? $pendingEpisodeData.title
            : $pendingEpisodeData.title.substring(0, 100) + "...",
        feedID: $selectedPodcast.id,
        episode:
          $pendingEpisodeData.title.length < 101
            ? $pendingEpisodeData.title
            : $pendingEpisodeData.title.substring(0, 100) + "...",
        itemID: $pendingEpisodeData.id,
        episode_guid: $pendingEpisodeData?.guid?.["#text"]
          ? $pendingEpisodeData?.guid?.["#text"]
          : $pendingEpisodeData?.guid,
        ts: 0,
        action: "boost",
        app_name: "CurioCaster",
        value_msat_total: amount * 1000,
        url: $selectedPodcast.url,
      },
    };
  }

  if (!$anonBoost) {
    console.log($nickName);
    baseRecord[7629169].sender_name = $nickName;
    baseRecord[7629169].sender_id =
      $userState?.wallet?.address?.lightning_address;
  } else {
    baseRecord[7629169].sender_name = "anonymous";
    baseRecord[7629169].sender_id = encryptString(
      $userState?.wallet?.address?.lightning_address,
      $userState?.wallet?.address?.lightning_address
    );
  }

  if ($playingEpisode.liveStatus === "live") {
    delete baseRecord[7629169].ts;
  }

  if ($boostBacks) {
    baseRecord[7629169].reply_address =
      $userState.wallet.address.keysend_pubkey;
    baseRecord[7629169].reply_custom_key = Number(
      $userState.wallet.address.keysend_custom_key
    );
    baseRecord[7629169].reply_custom_value =
      $userState.wallet.address.keysend_custom_value;
  }
  if ($walletValueBlock?.feedGuid) {
    baseRecord[7629169].remote_feed_guid = $walletValueBlock?.feedGuid;
  }
  if ($walletValueBlock?.itemGuid) {
    baseRecord[7629169].remote_item_guid = $walletValueBlock?.itemGuid;
  }

  baseRecord = cleanObject(baseRecord);

  return baseRecord;
}

async function encryptString(str, secretKey) {
  if (!str || !secretKey) return;

  // Convert string to ArrayBuffer
  let enc = new TextEncoder();
  let encodedMessage = enc.encode(str);

  // Hash the secretKey to ensure it is 256 bits long
  let hashedKey = await crypto.subtle.digest("SHA-256", enc.encode(secretKey));

  // Generate a key from the hashed secret key
  let key = await crypto.subtle.importKey(
    "raw",
    hashedKey,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt"]
  );

  // Use a fixed initialization vector (not recommended for production)
  let iv = new Uint8Array(16); // AES-CBC requires a 16-byte IV

  // Encrypt the message
  let encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv },
    key,
    encodedMessage
  );

  // Convert the result to a base64 string
  return btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
}

function cleanObject(obj) {
  Object.keys(obj).forEach((key) => {
    if (
      !obj[key] ||
      (obj[key] &&
        typeof obj[key] === "object" &&
        !Object.keys(obj[key]).length)
    ) {
      delete obj[key];
    }
  });
  return obj;
}
