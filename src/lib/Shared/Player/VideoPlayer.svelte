<script>
  import Streaming from "../../Modals/Wallet/Streaming/Streaming.svelte";
  import { browser } from "$app/environment";
  import {
    player,
    playingEpisode,
    playingPodcast,
    isPlayerLoaded,
    posterUrl,
    walletDisabled,
    goFullscreen,
  } from "$/stores";

  // if (browser) {
  // 	var isIOS = (function () {
  // 		var iosQuirkPresent = function () {
  // 			var audio = new Audio();

  // 			audio.volume = 0.5;
  // 			return audio.volume === 1; // volume cannot be changed from "1" on iOS 12 and below
  // 		};

  // 		var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  // 		var isAppleDevice = navigator.userAgent.includes('Macintosh');
  // 		var isTouchScreen = navigator.maxTouchPoints >= 1; // true for iOS 13 (and hopefully beyond)

  // 		return isIOS || (isAppleDevice && (isTouchScreen || iosQuirkPresent()));
  // 	})();
  // }

  let width;

  $: if ($posterUrl && $isPlayerLoaded && $playingEpisode) {
    $player?.poster($posterUrl);

    if (showVideo) {
      let poster = document.querySelector("#video > div.vjs-poster");
      if (poster) {
        poster.style.position = "";
        poster.style.display = "";
        poster.style.height = "";
        poster.style.width = "";
      }
    } else {
      let poster = document.querySelector("#video > div.vjs-poster");
      if (poster) {
        poster.style.position = "absolute";
        poster.style.display = "initial";
        poster.style.height = "100%";
        poster.style.width = "100%";
      }
    }
  }
</script>

<div
  class="container"
  class:fullscreen={$goFullscreen}
  bind:clientWidth={width}
  style="--player-height: {width}px"
>
  <!-- svelte-ignore a11y-media-has-caption-->

  <video
    id="video"
    class="video-js vjs-default-skin vjs-big-play-centered"
    disableRemotePlayback
    playsinline
    preload="metadata"
    controls
  />
</div>

<style>
  .container {
    width: calc(100% - 32px);
    /* max-width: 360px; */
    height: var(--player-height);
    max-height: 380px;

    /* eventually make this based on container height */
  }

  .fullscreen {
    position: absolute !important;
    width: 100vw;
    height: 100vh !important;
    max-height: 100vh;
  }

  :global(.video-js) {
    height: 100%;
    width: 100%;
  }
</style>
