<script>
  import sha256 from "crypto-js/sha256";
  import { v4 as uuidv4 } from "uuid";
  import parseSRT from "parse-srt";
  import PlayingImg from "$lib/Shared/NowPlaying/PlayingImg.svelte";
  import getChapters from "$functions/getChapters";

  import Hls from "hls.js";

  import ControlsOverlay from "$lib/Shared/NowPlaying/ControlsOverlay.svelte";

  import { browser } from "$app/environment";

  import {
    playingPodcast,
    playingEpisode,
    playingEpisodeChapters,
    chapterIndex,
    chapterDisplayImage,
    showMobile,
    showCC,
    playingEpisodeTranscript,
    transcriptIndex,
    playerIsPaused,
    showVideo,
    posterUrl,
    player,
    playerTime,
    playerDuration,
    userState,
    initialEpisode,
    srcStartTime,
    srcStopTime,
    useDefaultChapter,
  } from "$/stores";

  export let data;
  let podcast = data.podcast;
  let episode = data.episode;
  $playingPodcast = podcast;
  $playingEpisode = episode;
  $initialEpisode = episode;
  $showMobile = true;
  let imageWidth;
  let isM3U8 = false;

  $: $chapterDisplayImage =
    $playingEpisode &&
    $playingEpisodeChapters &&
    $chapterIndex &&
    $useDefaultChapter &&
    $playingEpisodeChapters[$chapterIndex]?.img;

  $: chapter =
    $chapterIndex > -1 &&
    $playingEpisode &&
    $playingEpisodeChapters &&
    $useDefaultChapter &&
    $playingEpisodeChapters[$chapterIndex];

  let imageNode;

  let showOverlay = true;

  let fadeTimeout;

  function handleMouseMove() {
    showOverlay = true;
    if (fadeTimeout) {
      clearTimeout(fadeTimeout);
    }
  }

  function handleMouseLeave() {
    startFade(500);
  }

  function handleOverlayTouch() {
    startFade(2500);
  }

  function handleOverlayMove() {
    startFade(2500);
  }

  function handleShowOverlayTouch() {
    showOverlay = true;
    startFade(2500);
  }

  function startFade(time) {
    if (fadeTimeout) {
      clearTimeout(fadeTimeout);
    }
    fadeTimeout = setTimeout(() => {
      showOverlay = false;
    }, time);
  }

  if ($playingEpisode?.chaptersUrl) {
    getChapters(episode?.chaptersUrl).then((chapters) => {
      $playingEpisodeChapters = chapters;
    });
  } else {
    $playingEpisodeChapters = undefined;
  }

  async function getTranscript(transcriptSRT) {
    if (browser) {
      let res = await fetch(`/api/httpsproxy?url=` + transcriptSRT.url);
      if (res.status === 200) {
        let text = await res.text();
        let transcript = parseSRT(text);
        let t = transcript
          .map((v) => v.text)
          .join(" ")
          .replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, " ");

        transcript.full = t.split("|-|").join(" ");
        $playingEpisodeTranscript = transcript;
        if ($playingEpisode.title === $playingEpisode.title) {
          $playingEpisodeTranscript = transcript;
        }
      } else {
        $playingEpisodeTranscript = null;
      }
    }
  }

  $: $posterUrl =
    $chapterDisplayImage ||
    $playingEpisode?.image ||
    $playingPodcast?.artwork ||
    $playingPodcast?.image ||
    "";

  $: if ($playingEpisode && $playingEpisode.transcripts) {
    const transcriptSRT = $playingEpisode.transcripts?.find(
      ({ type }) =>
        type === "application/srt" ||
        type === "text/srt" ||
        type === "application/x-subrip"
    );

    if (transcriptSRT?.url) {
      getTranscript(transcriptSRT);
    } else {
      $playingEpisodeTranscript = null;
    }
  } else {
    $playingEpisodeTranscript = null;
  }

  let playerTimeout;

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

  async function playerSetup() {
    $player.volume = $userState.volume || 1;

    $player.onloadedmetadata = async () => {
      $playerDuration = $player.duration;
      $playerTime = $player.currentTime;
    };

    $player.ontimeupdate = handleTimeUpdate;
  }

  async function handleTimeUpdate() {
    $playerTime = $player.currentTime;

    //updates the chapters images to current position
    while (
      $playerTime >= $playingEpisodeChapters?.[$chapterIndex + 1]?.startTime
    ) {
      $chapterIndex++;
    }

    while ($playerTime < $playingEpisodeChapters?.[$chapterIndex]?.startTime) {
      $chapterIndex--;
    }

    if ($playingEpisodeChapters[$chapterIndex].endTime) {
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

    while ($playerTime < $playingEpisodeTranscript?.[$transcriptIndex]?.start) {
      $transcriptIndex--;
    }
  }

  function setULID(src) {
    //See if a pciguid exists in local storage.  They are stored using a hash of the enclosure url as the key to avoid
    //character encoding issues with what browsers accept as a valid key.  If the value exists, get it.  If not, create
    //a new on and store it for potential use later if this enclosure is played again by this user
    let stripped = src.split("?")[0];
    let enclosureHash = sha256(stripped);
    var pciStatsGuid = localStorage.getItem(enclosureHash);
    if (pciStatsGuid === null) {
      pciStatsGuid = uuidv4();
      localStorage.setItem(enclosureHash, pciStatsGuid);
    }

    //Attach the pciguid value to the end of the enclosure url as a query parameter to pass back to the host/cdn for
    //anonymous, yet reliable tracking stats
    var pciGuid = "";
    if (src.indexOf("?") > -1) {
      pciGuid = "&_ulid=" + pciStatsGuid;
    } else {
      pciGuid = "?_ulid=" + pciStatsGuid;
    }

    //Tag a _from on the end to give a stats hint
    var fromTag = "&_from=curiocaster.com";
    if (src.indexOf("_from=") > -1) {
      fromTag = "";
    }

    //Assemble the new url
    return src + pciGuid + fromTag;
  }

  function setSource(src) {
    $showVideo =
      $playingEpisode && `${$playingEpisode.enclosureType}`.includes("video");
    if ($player && src) {
      // src =
      // 	'https://noagendatube.com/static/streaming-playlists/hls/54ebb881-8581-4b16-b3ba-04dcac230fd4/master.m3u8';

      // // console.log($feedItems);
      // console.log(src);

      if (src.includes(".m3u8")) {
        isM3U8 = true;
        $showVideo = true;
        if ($player.canPlayType("application/vnd.apple.mpegurl")) {
          $player.src = setULID(src);
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
            });
          });
        }
      } else {
        $player.src = setULID(src);
      }
    }
  }

  function setSrcTimes() {
    if ($player && $srcStopTime) {
      if (!isM3U8) {
        $player.src = $player.src =
          setULID($player.src) + `#t=${$srcStartTime || 0},${$srcStopTime}`;
      }
    }
  }

  $: setSource($player && $playingEpisode?.enclosureUrl);
  $: setSrcTimes($player && $playingEpisode?.enclosureUrl);
</script>

<div class="container">
  <div class="player" class:hide={!$showVideo}>
    <video
      disableRemotePlayback
      playsinline
      preload="metadata"
      controls
      poster={$posterUrl}
      bind:this={$player}
      class:hide={!$showVideo}
    />
  </div>
  <div
    class="img-container"
    class:show-background={showOverlay}
    class:hide={$showVideo}
    class:show-mobile={$showMobile}
    bind:clientWidth={imageWidth}
    style={`min-height: ${imageWidth}px`}
  >
    <div
      class="overlay-clicker"
      on:mousemove={handleMouseMove}
      on:touchend|stopPropagation|preventDefault={handleShowOverlayTouch}
    />
    <div
      class="overlay-container"
      class:show-overlay={showOverlay}
      on:mouseleave={handleMouseLeave}
      on:touchstart={handleOverlayTouch}
      on:touchmove={handleOverlayMove}
    >
      <ControlsOverlay />
    </div>

    <div class="playing-img-container">
      <PlayingImg bind:imageNode />
    </div>
    {#if $showCC && $playingEpisodeTranscript && !$playerIsPaused}
      <div class="cc-container" on:mousemove={handleMouseMove}>
        <div class="cc">
          {@html $playingEpisodeTranscript?.[$transcriptIndex]?.text || ""}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 320px;
    max-height: 320px;
    overflow: auto;
    position: relative;
    overflow: hidden;
    opacity: 1;
    transition: opacity 0.3s;
  }

  .player {
    max-width: 320px;
    max-height: 320px;
  }

  video {
    width: 100%;
  }

  .img-container {
    position: relative;
    display: grid;
    place-content: center;
    background-color: transparent;
    border-radius: 8px;
    transition: background-color 0.3s linear;
    flex-grow: 1;
  }

  .show-background {
    background-color: var(--image-container-overlay-background);
    transition: background-color 0.1s linear;
  }

  .overlay-clicker {
    min-height: 100%;
    min-width: 100%;
    position: absolute;
    z-index: 2;
  }

  .playing-img-container {
    filter: drop-shadow(0px 2px 3px #000);
    width: 100%;
  }

  .overlay-container {
    position: absolute;
    top: 0;
    border-radius: 8px;
    width: 100%;
    height: 100%;
    z-index: 3;
    visibility: hidden;
    opacity: 0;
    transition:
      visibility 0s 0.3s,
      opacity 0.3s linear;
  }

  .show-overlay {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.1s linear;
  }

  .fullscreen {
    position: initial;
  }
  .logo {
    justify-content: center;
  }

  .chapter-titles {
    width: 100%;
    height: 100px;
    display: grid;
    place-items: center;
    flex-shrink: 1;
    margin-top: 8px;
  }

  p {
    font-size: 1.2em;
    font-weight: 700;
    color: var(--primary-text-color);
    padding: 0;
    text-align: center;
  }

  a {
    font-size: 1.2em;
    font-weight: 700;
    padding: 0;
    text-align: center;
  }

  .hide {
    display: none;
  }

  .cc-container {
    position: absolute;
    bottom: 40px;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 9;
  }
  .cc {
    color: white;
    background-color: rgba(0, 0, 0, 0.75);
    margin: 0 auto;
    display: inline-block;
    padding: 4px 8px;
    text-align: center;
  }

  .hide {
    display: none;
  }
</style>
