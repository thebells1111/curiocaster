<script>
  import clone from "just-clone";

  import getPodcastList from "$functions/getPodcastList";
  import startEpisodeUpdates from "./startEpisodeUpdates";
  import sortEpisodes from "$functions/sortEpisodes";
  import sortChapters from "$functions/sortChapters";
  import getTranscript from '$functions/getTranscript';

  import getRSS from "$functions/getRSSFeed";

  import getWalletValueBlock from "$functions/getWalletValueBlock";

  import {
    userStateDB,
    podcastStateDB,
    userState,
    userStateLoaded,
    displayShowNotesPane,
    playingEpisodeState,
    playingEpisode,
    playingPodcast,
    playingPodcastState,
    playerTime,
    playerDuration,
    selectedPodcast,
    episodesList,
    filteredEpisodesList,
    selectedEpisode,
    selectedPlayingList,
    selectedPodcastState,
    playingList,
    middlePane,
    devMode,
    walletDisabled,
    defaultBoostValue,
    defaultStream,
    playingStream,
    playingBoostValue,
    swiper,
    enableAutoplay,
    initialPodcast,
    isPlayerLoaded,
    initialEpisode,
    chapterDisplayImage,
    posterUrl,
    remoteServer,
    proxy,
    nickName,
    isLoaded,
    srcStartTime,
    playingEpisodeChapters,
    playingEpisodeTranscript,
    player,
    btcPrice,
    walletCurrency,
    mergedEpisodesType,
    recentEpisodes,
    recentSettings,
    podcastDB,
    episodeSorter,
    tempDB,
    anonBoost,
    anonStream,
    anonBoostagram,
    boostBacks,
    remoteLiveSplits,
    playingSplitbox,
    splitbox,
  } from "$/stores";

  import { browser } from "$app/environment";

  function proxyUrl(url) {
    if (url) {
      if (url.includes("https")) {
        return url;
      }
      return proxy + encodeURIComponent(url);
    }
    return url;
  }

  $: $posterUrl =
    proxyUrl($remoteLiveSplits?.image) ||
    proxyUrl($chapterDisplayImage) ||
    proxyUrl($playingEpisode?.image) ||
    proxyUrl($playingPodcast?.artwork) ||
    proxyUrl($playingPodcast?.image) ||
    "";

  if (browser) {
    getPodcasts();
    // getNotifications();
  }
  async function getPodcasts() {
    try {
      // backupDB();
      // fake();
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
      }

      setCompleteStatus();
      getRecentEpisodes();
      getPodcastList();
      getBTC();
      await getUserState();

      $userStateLoaded = true;
      setPanes();
      await loadEpisodesList();
      $isLoaded = true;
      startEpisodeUpdates();
      if (!$isPlayerLoaded) {
        // loadAudioPlayer();
        // initVideoJsHlsJsPlugin(hash);
      }
      $player.currentTime = $playerTime;

      $displayShowNotesPane = true;
      getWalletValueBlock($playingEpisode, $playingPodcast);
    } catch (err) {
      console.log(err);
      if (devMode) {
        console.log(err);
      }
    }
  }

  function fake() {
    podcastDB
      .iterate(function (value, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.

        value.episodes = value?.episodes?.filter((v) => {
          return v.datePublished < new Date().getTime() / 1000 - 604800;
        });

        podcastDB.setItem(key, value);
      })
      .then(function () {
        console.log("Iteration has completed");
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  }

  function backupDB() {
    podcastDB
      .iterate(function (value, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.

        tempDB.setItem(key, value);
        console.log([key, value]);
      })
      .then(function () {
        console.log("Iteration has completed");
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  }

  function setCompleteStatus() {
    podcastDB
      .iterate(function (podcast, key, iterationNumber) {
        if (key !== "undefined") {
          podcastStateDB.getItem(key).then((state) => {
            state = state || {};
            if (!state?.hasOwnProperty("filterCompletedEpisodes")) {
              state.filterCompletedEpisodes = true;
              podcastStateDB.setItem(key, state);
            }
          });
        }
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
      });
  }

  async function getUserState() {
    return new Promise(async (resolve, reject) => {
      let state = await userStateDB.getItem("userState");
      $userState = state || $userState;
      $userState.wallet = $userState.wallet || {
        saved: false,
        disabled: false,
        defaultBoost: 0,
        defaultStream: 0,
        currency: "usd",
        mergedEpisodesType: "Recent Episodes",
      };

      $nickName = $userState.nickName || $nickName;
      $boostBacks = $userState.boostBacks || $boostBacks;
      $anonBoost = $userState?.anon?.boost || $anonBoost;
      $anonStream = $userState?.anon?.stream || $anonStream;
      $anonBoostagram = $userState?.anon?.boostagram || $anonBoostagram;
      $mergedEpisodesType = $userState.mergedEpisodesType || "Recent Episodes";

      $userState.enableAutoplay =
        $userState.enableAutoplay === undefined
          ? true
          : $userState.enableAutoplay;

      $walletDisabled = $userState.wallet.disabled;
      $defaultBoostValue = $userState.wallet.usdDefaultBoost || 0;
      $defaultStream = $userState.wallet.usdDefaultStream || 0;

      $walletCurrency = $userState.wallet.currency;

      $enableAutoplay = $userState.enableAutoplay;

      $recentSettings = $userState?.recentSettings || $recentSettings;

      $selectedPlayingList = $userState?.playing.selectedList;
      if (!$initialEpisode && $userState?.playing?.podcast) {
        let id = $userState?.playing?.podcast.id;
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
          $playingPodcast = podcast;
        }
        $playingEpisode = $userState.playing.episode;
        $playingEpisodeState = $userState.playing.episodeState;
      }

      $playerTime = $srcStartTime || $userState.playing.episodeState?.time || 0;
      $playerDuration = $userState.playing.episodeState?.duration || 0;

      if ($playingEpisode?.chaptersUrl) {
        const res = await fetch(
          `/api/httpsproxy?url=` +
            encodeURIComponent($playingEpisode?.chaptersUrl)
        );
        const chapters = await res.json();
        $playingEpisodeChapters = sortChapters(chapters);
      }

      $playingEpisodeTranscript = await getTranscript($playingEpisode?.transcripts);

      resolve();
    });
  }

  async function getBTC() {
    let res = await fetch(
      "https://blockchain.info/tobtc?currency=USD&value=10000"
    );

    $btcPrice = await res.text();
  }

  async function getRecentEpisodes() {
    $recentEpisodes = await podcastDB.getItem("recent");
    $filteredEpisodesList = $recentEpisodes;
  }

  async function loadEpisodesList() {
    let podcastId = $initialPodcast?.id || $userState.playing.podcast?.id;

    if (podcastId) {
      if (!$initialPodcast && podcastId) {
        let urls = [
          `${remoteServer}api/queryindex?q=podcasts/byfeedid?id=` + podcastId,
          `${remoteServer}api/queryindex?q=episodes/byfeedid?` +
            encodeURIComponent(`id=${podcastId}&max=1000`),
        ];
        await Promise.all(
          urls.map((url) => fetch(url).then((response) => response.json()))
        ).then((data) => {
          if (data[0].status) {
            let feed = data[0].feed;
            feed.episodes = data[1].items;
            $initialPodcast = feed;
          }
        });
      }

      getRSS($initialPodcast.url);

      $playingSplitbox = clone($splitbox);
      console.log($splitbox);
      console.log($playingSplitbox);

      $selectedPodcast = $initialPodcast;
      $episodesList = $selectedPodcast.episodes;

      if ($initialEpisode) {
        $selectedEpisode = $initialEpisode || $selectedPodcast.episodes[0];
        $playingEpisode = $selectedEpisode;
        $playingPodcast = $selectedPodcast;
      } else {
        $selectedEpisode = $selectedPodcast.episodes[0];
      }
    }

    $playingPodcastState = await podcastStateDB.getItem(
      `${$playingPodcast.id}`
    );

    $selectedPodcastState =
      (await podcastStateDB.getItem(`${$selectedPodcast.id || "recent"}`)) ||
      {};

    if ($selectedPodcast.episodes) {
      $filteredEpisodesList = $selectedPodcast.episodes;
    }

    $episodeSorter = $selectedPodcastState.episodeSorter || "newest";
    $filteredEpisodesList = sortEpisodes($filteredEpisodesList, $episodeSorter);

    $playingBoostValue = $playingPodcastState?.boost ?? $defaultBoostValue;
    $playingStream = $playingPodcastState?.stream ?? $defaultStream;

    let episodeState = $playingPodcastState?.[$playingEpisode.guid] || {};
    $playingEpisodeState = episodeState;
  }

  function setPanes() {
    if ($swiper) {
      if ($initialEpisode) {
        $swiper.slideTo(0, 0);
      }
    } else {
      if ($initialEpisode) {
        $middlePane = "nowPlaying";
      } else {
        $userState.playing.selectedList = "episodes";
        $playingList = $playingPodcast.episodes;
        $middlePane = "episodesList";
      }
    }
  }

  async function getNotifications() {
    const ws = new WebSocket("wss://api.livewire.io/ws/podping");
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      // see message format below
      if (msg.t === "podping") {
        console.log("podping message", msg);
        for (const op of msg.p) {
          if (op.i === "podping") {
            // version 0.x payload
            for (const url of op.p.urls) {
              // process feed url
            }
          } else {
            // version 1.0 payload
            for (const iri of op.p.iris) {
              // process iri
            }
          }
        }
      }
    });
    ws.addEventListener("close", (event) => {
      // handle close event
    });
    ws.addEventListener("error", (event) => {
      // handle error event
    });
  }
</script>
