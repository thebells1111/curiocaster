<script>
  import savePlayingPodcastState from "$functions/savePlayingPodcastState.js";
  import loadEpisode from "$functions/loadEpisode.js";
  import sortEpisodes from "$functions/sortEpisodes";
  import getWalletValueBlock from "$functions/getWalletValueBlock";
  import Hls from "hls.js";
  import clone from "just-clone";
  import findMatchingEpisodeFromFeed from "$functions/findMatchingEpisodeFromFeed";
  import io from "socket.io-client";
  import { browser } from "$app/environment";

  import {
    userState,
    player,
    playingEpisodeChapters,
    selectedPodcast,
    playingEpisode,
    playingPodcast,
    playerTime,
    chapterIndex,
    playingList,
    playerDuration,
    isPlayerLoaded,
    playingEpisodeState,
    podcastStateDB,
    playingPodcastState,
    selectedPodcastState,
    mediaSession,
    swiper,
    podcastListPane,
    podcastList,
    playerSaveTime,
    posterUrl,
    showVideo,
    playingEpisodeTranscript,
    transcriptIndex,
    episodeIsReady,
    playerIsPaused,
    liveLoading,
    enableAutoplay,
    filteredEpisodesList,
    episodesList,
    episodeSorter,
    showRecentEpisodes,
    recentEpisodes,
    sleepStopTime,
    sleepOnEpisodeEnd,
    currentSplitDestinations,
    feedItems,
    liveEpisodes,
    remoteLiveSplits,
    liveItemSocket,
    useDefaultChapter,
    remoteServer,
  } from "$/stores";

  let saveTimeInterval = 60;
  let oncanplayTimeout;
  let episodeLoaded = false;

  let debug = true;
  function print(str) {
    if (debug) {
      console.log(str);
    }
  }

  let playerTimeout;
  let loadingLive = false;
  let liveLoaded = true;

  let valueTimeSplitBlock;
  let currentSplit;
  let previousSplit;
  let currentBlock;

  $: setSource($playingEpisode?.enclosureUrl);

  function setSource(src) {
    $showVideo =
      $playingEpisode && `${$playingEpisode.enclosureType}`.includes("video");
    console.log();
    if ($player && src) {
      // src =
      // 	'https://noagendatube.com/static/streaming-playlists/hls/54ebb881-8581-4b16-b3ba-04dcac230fd4/master.m3u8';

      if (src.includes(".m3u8")) {
        $showVideo = true;
        if ($player.canPlayType("application/vnd.apple.mpegurl")) {
          $player.src = src;
          //
          // If no native HLS support, check if HLS.js is supported
          //
        } else if (Hls.isSupported()) {
          console.log("hello hls.js!");
          var hls = new Hls();
          // bind them together
          hls.attachMedia($player);
          // MEDIA_ATTACHED event is fired by hls object once MediaSource is ready
          hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            console.log("video and hls.js are now bound together !");
            hls.loadSource(src);
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              console.log(
                "manifest loaded, found " +
                  data.levels.length +
                  " quality level"
              );
              $player.play();
            });
          });
        }
      } else {
        $player.src = src;
      }
    }
  }

  $: setvalueTimeSplitBlock($playingEpisode, $feedItems);
  $: setLiveSplitUrl($playingEpisode, $liveEpisodes);

  function setLiveSplitUrl() {
    const matchingItem = findMatchingEpisodeFromFeed(
      $liveEpisodes,
      $playingEpisode
    );
    let url = matchingItem?.liveValueLink;

    // url =
    //   "http://localhost:8000/event?event_id=23ebe5c2-e791-4dcf-aaf3-751836961e66";
    startListening(url);
  }

  function startListening(url) {
    console.log("url: ", url);
    $liveItemSocket = undefined;
    // Only create new connection if there isn't already one
    if (browser && (!$liveItemSocket || $liveItemSocket.disconnected) && url) {
      $liveItemSocket = io.connect(url);
      $liveItemSocket.on("remoteValue", function (data) {
        $remoteLiveSplits = data;
        getWalletValueBlock(
          $playingEpisode,
          $playingPodcast,
          data?.value,
          data?.feedGuid,
          data?.itemGuid
        );
      });
    }
  }
  function setvalueTimeSplitBlock() {
    const matchingItem = findMatchingEpisodeFromFeed(
      $feedItems,
      $playingEpisode
    );
    valueTimeSplitBlock = [].concat(
      matchingItem?.["podcast:value"]?.["podcast:valueTimeSplit"] || []
    );
  }

  function setPlayerTime() {
    if ($player) {
      if (playerTimeout) {
        clearTimeout(playerTimeout);
      }
      playerTimeout = setTimeout(playerSetup, 200);
    } else {
      setTimeout(setPlayerTime, 100);
    }
  }

  setPlayerTime();

  $: if (loadingLive && !liveLoaded) {
    console.log("loading");
    $liveLoading = true;
  } else {
    $liveLoading = false;
    console.log("loaded");
  }

  async function playerSetup() {
    if ($userState.volume > 1) {
      $userState.volume = 1;
    }
    $player.volume = $userState.volume || 1;
    $mediaSession = navigator.mediaSession;
    setHandlers();

    $player.currentTime = $playerTime;
    $player.playbackRate = $userState.playbackSpeed;
    $player.defaultPlaybackRate = $userState.playbackSpeed;
    if ($playingPodcast.title) {
      if ($swiper) {
        $swiper.slideTo(0, 0);
      }
      if ($podcastList.length > 0) {
        $podcastListPane = "subscriptions";
      }
    }

    $player.onplay = async () => {
      $playerIsPaused = false;
      if (!liveLoaded) {
        loadingLive = true;
      }
      if ($playingEpisode.liveStatus === "live") {
        $player.playbackRate = 1;
      }

      if ($sleepStopTime && new Date().getTime() >= $sleepStopTime) {
        $sleepStopTime = 0;
        $sleepOnEpisodeEnd = false;
      }
    };

    $player.onpause = async () => {
      if ($playingEpisode.liveStatus === "live") {
        $player.src = "";
        setTimeout(() => {
          $player.src = $playingEpisode?.enclosureUrl;
          liveLoaded = false;
        }, 0);
      }
      $playerIsPaused = true;
      savePlayingPodcastState("handleplaybutton");
    };

    $player.onended = async () => {
      if ($playingEpisode.status === "live") {
        $player.play();
      } else {
        await handleEpisodeEnd();
      }
    };

    async function handleEpisodeEnd() {
      $playingEpisodeState.time = 0.0;
      $playerTime = 0;
      $playingEpisodeState.complete = true;
      const id = $playingEpisode.guid;
      $playingPodcastState[id] = $playingEpisodeState;

      if ($recentEpisodes.find(({ guid }) => guid === id)) {
        const recentState = await updateRecentState(id);

        if ($showRecentEpisodes) {
          $selectedPodcastState = recentState;
          updateFilteredEpisodesList();
        }
      }

      await podcastStateDB.setItem(
        `${$playingPodcast.id}`,
        $playingPodcastState
      );

      const currentIndex = $playingList.findIndex(
        (episode) =>
          $playingEpisode.enclosureUrl === episode?.enclosureUrl &&
          $playingEpisode.datePublished === episode.datePublished
      );

      const nextPodcast =
        $playingList[currentIndex + 1]?.podcast || $playingPodcast;

      if (
        currentIndex > -1 &&
        currentIndex < $playingList.length - 1 &&
        $enableAutoplay &&
        !$sleepOnEpisodeEnd
      ) {
        setTimeout(
          loadEpisode.bind(this, $playingList[currentIndex + 1], nextPodcast),
          0
        );
      }

      $sleepOnEpisodeEnd = false;

      if ($selectedPodcast?.id === $playingPodcast.id && !$showRecentEpisodes) {
        $selectedPodcastState = $playingPodcastState;
        updateFilteredEpisodesList();
      }
    }

    async function updateRecentState(id) {
      const recentState = (await podcastStateDB.getItem("recent")) || {};
      recentState[id] = recentState[id] || {};
      recentState[id].complete = true;
      await podcastStateDB.setItem("recent", recentState);
      return recentState;
    }

    function updateFilteredEpisodesList() {
      if ($selectedPodcastState?.filterCompletedEpisodes) {
        $filteredEpisodesList = sortEpisodes($episodesList, $episodeSorter);
      }
    }

    $player.onloadedmetadata = async () => {
      $episodeIsReady = true;
      $playerDuration = $player.duration;

      if ($playingEpisode.liveStatus === "live") {
        $playerDuration = 0;
        $playerTime = 0;
      }

      if ($mediaSession) {
        $mediaSession.metadata = new MediaMetadata({
          title: $playingPodcast.title,
          artist: $playingEpisode.title,
          artwork: [
            {
              src:
                $playingEpisode?.image ||
                $playingPodcast?.artwork ||
                $playingPodcast?.image ||
                "./CurioLogo512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        });
      }
      if ($isPlayerLoaded) {
        episodeLoaded = true;
      }
    };

    $player.oncanplay = async () => {
      if ($playingEpisode.liveStatus === "live") {
        loadingLive = false;
        liveLoaded = true;
      } else {
        if (!$isPlayerLoaded) {
          setTimeout(() => ($isPlayerLoaded = true), 500);
        } else if (episodeLoaded) {
          episodeLoaded = false;
          if (oncanplayTimeout) {
            clearTimeout(oncanplayTimeout);
          }
          oncanplayTimeout = setTimeout(() => {
            $player.play();
          }, 500);
        }
      }
    };

    $player.ontimeupdate = handleTimeUpdate;

    function setHandlers() {
      const actionHandlers = [
        [
          "play",
          () => {
            $player.play();
            $playerIsPaused = false;
            $mediaSession.playbackState = "playing";
            console.log("play");
          },
        ],
        [
          "pause",
          () => {
            $player.pause();
            $playerIsPaused = true;
            $mediaSession.playbackState = "paused";
            console.log("pause");
          },
        ],
        [
          "previoustrack",
          () => {
            $player.currentTime = Math.max($player.currentTime - 10, 0);
          },
        ],
        [
          "nexttrack",
          () => {
            $player.currentTime = Math.min(
              $player.currentTime + 30,
              $player.duration
            );
          },
        ],
        [
          "stop",
          () => {
            /* ... */
          },
        ],
        [
          "seekbackward",
          (details) => {
            $player.currentTime = Math.max($player.currentTime - 10, 0);
          },
        ],
        [
          "seekforward",
          (details) => {
            print(details);
            $player.currentTime = Math.min(
              $player.currentTime + 30,
              $player.duration
            );
          },
        ],
        [
          "seekto",
          (details) => {
            print(details);
          },
        ],
      ];

      for (const [action, handler] of actionHandlers) {
        try {
          $mediaSession.setActionHandler(action, handler);
        } catch (error) {
          print(`The media session action "${action}" is not supported yet.`);
        }
      }
    }
  }

  async function handleTimeUpdate() {
    if ($playingEpisode.liveStatus === "live") {
      $playerDuration = $playerTime;
    }

    if ($episodeIsReady) {
      $playerTime = $player?.currentTime;
      findCurrentSplit($playerTime);

      //updates the chapters images to current position
      while (
        $playerTime >= $playingEpisodeChapters?.[$chapterIndex + 1]?.startTime
      ) {
        $chapterIndex++;
      }

      while (
        $playerTime < $playingEpisodeChapters?.[$chapterIndex]?.startTime
      ) {
        $chapterIndex--;
      }

      if ($playingEpisodeChapters?.[$chapterIndex]?.endTime) {
        if ($playerTime > $playingEpisodeChapters[$chapterIndex].endTime) {
          $useDefaultChapter = true;
        } else {
          $useDefaultChapter = false;
        }
      } else {
        $useDefaultChapter = false;
      }

      while (
        $playerTime >= $playingEpisodeTranscript?.[$transcriptIndex + 1]?.start
      ) {
        $transcriptIndex++;
      }

      while (
        $playerTime < $playingEpisodeTranscript?.[$transcriptIndex]?.start
      ) {
        $transcriptIndex--;
      }

      if ($playerSaveTime < $playerTime) {
        savePlayingPodcastState("update");

        $playerSaveTime = $playerTime + saveTimeInterval;
      }
    } else {
      $player.currentTime = $playerTime;
      $player.play();
    }

    if ($sleepStopTime && new Date().getTime() >= $sleepStopTime) {
      $sleepStopTime = 0;
      $sleepOnEpisodeEnd = false;
      $player.pause();
    }
  }

  $: if (currentSplit) {
    handleNewSplit();
  }

  function findCurrentSplit(currentTime) {
    if (valueTimeSplitBlock?.length) {
      const nextBlock = valueTimeSplitBlock.find((block) => {
        const startTime = parseFloat(block["@_startTime"]);
        const endTime = startTime + parseFloat(block["@_duration"]);
        return currentTime >= startTime && currentTime <= endTime;
      });

      if (!nextBlock && currentSplit) {
        currentSplit = null;
        getWalletValueBlock($playingEpisode, $playingPodcast);
      } else if (JSON.stringify(nextBlock) !== JSON.stringify(currentBlock)) {
        currentBlock = nextBlock;
        handleSplit(nextBlock).then((data) => {
          currentSplit = data;
        });
      }
    }
  }

  function handleNewSplit() {
    console.log("new split");
    previousSplit = currentSplit;
    if (currentSplit) {
      const destinations = currentSplit?.valueBlock?.destinations;

      let feedValue = clone(
        $playingEpisode?.value?.destinations ||
          $playingPodcast?.value?.destinations
      );

      const feedDestinations = updateSplits(
        feedValue,
        100 - currentSplit.remotePercentage
      );

      const remoteDestinations = updateSplits(
        destinations,
        currentSplit.remotePercentage
      );
      $currentSplitDestinations = remoteDestinations
        .map(removeUndefinedKeys)
        .concat(feedDestinations);
    } else {
      $currentSplitDestinations = undefined;
    }

    getWalletValueBlock(
      $playingEpisode,
      $playingPodcast,
      $currentSplitDestinations
        ? {
            destinations: $currentSplitDestinations,
          }
        : undefined,
      currentSplit?.feedGuid,
      currentSplit?.itemGuid
    );
  }

  async function handleSplit(split) {
    if (split?.["podcast:remoteItem"]) {
      const feedGuid = split["podcast:remoteItem"]?.["@_feedGuid"];
      const itemGuid = split["podcast:remoteItem"]?.["@_itemGuid"];
      const startTime = split?.["@_startTime"];
      const duration = split?.["@_duration"];
      const remotePercentage = split?.["@_remotePercentage"];
      const feedGuidUrl =
        remoteServer +
        `api/queryindex?q=${encodeURIComponent(
          `/podcasts/byguid?guid=${feedGuid}`
        )}`;
      const itemsUrl =
        remoteServer +
        `api/queryindex?q=${encodeURIComponent(
          `/episodes/bypodcastguid?guid=${feedGuid}`
        )}`;

      let splitInfo = {};
      let valueBlock = { feed: null, item: null };

      const [feedData, itemsData] = await Promise.all([
        fetch(feedGuidUrl).then((res) => res.json()),
        fetch(itemsUrl).then((res) => res.json()),
      ]).catch((error) => {
        console.error("Error:", error);
      });

      let feed = feedData?.feed;
      splitInfo.feedGuid = split["podcast:remoteItem"]?.["@_feedGuid"];
      splitInfo.itemGuid = split["podcast:remoteItem"]?.["@_itemGuid"];
      splitInfo.album = feed?.title;
      splitInfo.artist = feed?.author;
      splitInfo.startTime = startTime;
      splitInfo.duration = duration;
      splitInfo.remotePercentage = remotePercentage;
      valueBlock.feed = feed?.value;

      let items = itemsData?.items;
      let item = items?.find((v) => v.guid === itemGuid);
      splitInfo.song = item?.title;
      valueBlock.item = item?.value;

      splitInfo.valueBlock = valueBlock.item || valueBlock.feed;
      return splitInfo;
    }
    return null;
  }

  function removeUndefinedKeys(obj) {
    if (obj) {
      return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== undefined)
      );
    }
  }

  function updateSplits(array, remotePercentage) {
    const newArray = [].concat(array);
    let totalSplit = 0;
    newArray.forEach((item) => {
      if (item?.fee !== true && item?.fee !== "true") {
        totalSplit += item?.split;
      }
    });

    let percentagedArray = clone(newArray).map((item) => {
      if (item?.fee !== true && item?.fee !== "true") {
        item.split = (item?.split / totalSplit) * remotePercentage;
      }
      return item;
    });

    return percentagedArray;
  }
</script>

<video
  disableRemotePlayback
  playsinline
  preload="metadata"
  controls
  bind:this={$player}
  poster={$posterUrl}
  class:hide={!$showVideo}
/>

<style>
  video {
    /* display: none */
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  .hide {
    display: none;
  }
</style>
