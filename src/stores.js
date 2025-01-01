import { writable } from "svelte/store";
import { browser, dev } from "$app/environment";

export let devMode = dev;
export let useSentry = false;

const server = "test";

export const serverUrls = {
  dev: "http://localhost:3000/api/",
  test: "/api/",
  prod: "https://curiohoster.com/api/",
};

export const serverUrl = serverUrls[server];
export const remoteServer = dev
  ? "http://localhost:8000/"
  : "https://curiohoster.com/";

export const proxy = "https://curiohoster.com/api/proxy?url=";

export const windowHeight = writable(null);

//databases
export const userStateDB =
  browser &&
  localforage.createInstance({
    name: "userStateDB",
  });
export const podcastStateDB =
  browser &&
  localforage.createInstance({
    name: "podcastStateDB",
  });
export const podcastDB =
  browser &&
  localforage.createInstance({
    name: "podcastDB",
  });
export const walletDB =
  browser &&
  localforage.createInstance({
    name: "walletDB",
  });

export const tempDB =
  browser &&
  localforage.createInstance({
    name: "tempDB",
  });

//state
export const mounted = writable(false);
export const initialPodcast = writable(null);
export const initialEpisode = writable(null);
export const userState = writable({
  user: "local",
  nick: "anonymous",
  playbackSpeed: 1.0,
  volume: 1,
  enableAutoplay: true,
  wallet: {
    saved: false,
    disabled: false,
    defaultBoost: 0,
    defaultStream: 0,
    currency: "usd",
    address: {
      keysend_custom_key: "",
      keysend_custom_value: "",
      keysend_pubkey: "",
      lightning_address: "",
    },
  },
  playing: {
    podcast: {},
    episode: {},
    podcastState: {},
    episodeState: {},
  },
});
export const loggedIn = writable(false);
export const nickName = writable("anonymous");
export const selectedPodcastState = writable({});
export const playingPodcastState = writable({});
export const playingEpisodeState = writable({});
export const enableAutoplay = writable(true);
export const updatingVersion = writable(false);
export const updatingVersionCount = writable(0);
export const filteringEpisodes = writable(false);
export const showMobileChat = writable(false);

//loadedStatus
export const isLoaded = writable(false);
export const isPlayerLoaded = writable(false);
export const userStateLoaded = writable(false);
export const nowPlayingLoaded = writable(false);
export const loadingStatus = writable("");
export const imageProxy = `/api/getimage?url=`;
export const posterUrl = writable(null);
export const podcastListPane = writable("search");
export const middlePane = writable("episodesList");
export const currentList = writable("podcastList");
export const currentDesktopView = writable("mainScreen");
export const currentEpisodeData = writable("showNotes");
export const rightPane = writable("showNotes");
export const mobileMiddlePane = writable("podcastList");
export const count = writable(0);
export const mainPodcastList = writable([]);
export const podcastList = writable([]);
export const episodesList = writable([]);
export const filteredEpisodesList = writable([]);
export const episodesListPane = writable();
export const showNotesPane = writable();
export const displayShowNotesPane = writable(false);
export const selectedEpisode = writable({});
export const selectedPodcast = writable({});
export const playingEpisode = writable({});
export const playingPodcast = writable({});
export const playingList = writable([]);
export const parser = writable();
export const selectedPlayingList = writable("playlist");
export const showSubscriptionShowNotes = writable(false);
export const liveEpisodes = writable([]);
export const lastLiveUpdate = writable(0);
export const showPodcastFilter = writable(false);
export const liveLoading = writable(false);
export const pendingEpisodes = writable([]);
export const feedTitle = writable("Recent Episodes");
export const feedItems = writable([]);
export const feedChannel = writable({});
export const playingFeedValue = writable([]);

//merged episode queues
export const recentEpisodes = writable([]);
export const newestEpisodes = writable({});
export const viewedEpisodes = writable(new Set());
export const showRecentEpisodes = writable(false);
export const markNewEpisodes = writable([]);
export const mergedEpisodesType = writable("Recent Episodes");
export const recentSeen = writable(new Set());
export const newEpisodesFlag = writable(false);
export const recentSettings = writable({ time: 7, maxEps: 3 });
export const updateWorker = writable(null);

//player
export const player = writable(null);
export const htmlPlayer = writable(null);
export const playerTime = writable(0);
export const playerRemainingTime = writable("");
export const playerSaveTime = writable(0);
export const playerDuration = writable(0);
export const playerIsPaused = writable(true);
export const trackSrc = writable(null);
export const playerSrc = writable(null);
export const playerSrcType = writable(null);
export const saveTimeInterval = writable(10);
export const goFullscreen = writable(false);
export const showPodcastSearch = writable(false);
export const isUpdatingEpisodes = writable(false);
export const updateEpisodesProgress = writable(0);
export const mobileNavButtons = writable([]);
export const searchListPodcastSelected = writable(false);
export const episodeIsReady = writable(true);
export const logoBackground = writable({});

//chapters
export const selectedEpisodeChapters = writable(null);
export const playingEpisodeChapters = writable(null);
export const chapterIndex = writable(0);
export const chapterDisplayImage = writable("");
export const useDefaultChapter = writable(false);

//transcripts
export const selectedEpisodeTranscript = writable(null);
export const playingEpisodeTranscript = writable(null);
export const transcriptIndex = writable(0);
export const currentMobilePage = writable(0);
export const showMobile = writable(false);
export const showMobileChapters = writable(false);
export const mobileFullScreen = writable(false);
export const podcastSearchResults = writable({ cat: "", feeds: [] });

//swiper
export const swiper = writable();
export const showNotesVerticalSwiper = writable();
export const showNotesModalSwiper = writable();
export const preferencesSwiper = writable();
export const pendingEpisodesSwiper = writable();
export const initialSlide = writable(1);

export const mediaSession = writable();
export const episodeSorter = writable("newest");

//modals
export const showCC = writable(true);
export const showDisclaimer = writable(false);
export const showVideo = writable(false);
export const showWallet = writable(false);
export const showBoost = writable(false);
export const showShareClip = writable(false);
export const showLogin = writable(false);
export const showInvoice = writable(false);
export const showOPML = writable(false);
export const showPreferences = writable(false);
export const showFF = writable(false);
export const showFFCreator = writable(false);
export const showCreateEpisode = writable(false);
export const showPending = writable(false);

//modalSwiper

export const modalSwiper = writable();
export const modalSwiperType = writable("");
export const listSwiper = writable();
export const listSwiperType = writable("");
export const resetEpisodesIndex = writable();
export const walletSwiper = writable();
export const walletSwiperType = writable("");

//wallet
export const satBalance = writable(null);
export const walletDisabled = writable(false);
export const defaultStream = writable(100);
export const defaultBoostValue = writable(1000);
export const playingStream = writable(100);
export const playingBoostValue = writable(1000);
export const walletValueBlock = writable(null);
export const streamingInterval = writable(60000);
export const boostSats = writable(null);
export const getBalance = writable(null);
export const streamingEnabled = writable(true);
export const boostEnabled = writable(true);
export const walletSaved = writable(false);
export const showBoostStatus = writable(false);
export const streamQueue = writable([]);
export const boostQueue = writable([]);
export const walletBusy = writable(false);
export const turnCameraOff = writable();
export const walletId = writable("");
export const pendingEpisodesWallet = writable(null);
export const pendingEpisodeData = writable(null);
export const boostBacks = writable(true);
export const splitbox = writable(null);
export const playingSplitbox = writable(null);

//btc conversion
export const walletCurrency = writable("usd");

//clip share
export const srcStartTime = writable(null);
export const srcStopTime = writable(null);
export const srcFastFollow = writable(null);

//hosting
export const rssEditor = writable(false);
export const togglePreview = writable(true);

//BTC conversion
export const btcPrice = writable(0);

//sleep timer
export const sleepStopTime = writable(0);
export const sleepOnEpisodeEnd = writable(false);

export const selectedMediaType = writable("podcast");

export const pendingBoosts = writable({});
export const clearedBoosts = writable({});
export const isProcessingBoosts = writable(false);

//anonymous
export const anonBoost = writable(false);
export const anonStream = writable(false);
export const anonBoostagram = writable(false);

export const deviceType = writable(null);

export const currentSplitDestinations = writable();

export const remoteLiveSplits = writable({});
export const liveItemSocket = writable();
