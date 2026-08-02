<script>
  import convertTime from "$functions/convertTime";

  import {
    showShareClip,
    devMode,
    playingPodcast,
    playingEpisode,
    playerTime,
    playerDuration,
    player,
  } from "$/stores";

  import { fade } from "svelte/transition";

  let linkCopied = false;
  let link;

  let startHrs = "0";
  let startMins = "00";
  let startSecs = "00";

  let stopHrs = "0";
  let stopMins = "00";
  let stopSecs = "00";

  function copyLink() {
    console.log($playingEpisode?.liveStatus === "live");
    let slug = `podcast/pi${$playingPodcast.id}/${
      $playingEpisode?.liveStatus === "live" ? "live" : $playingEpisode.id
    }`;

    if (devMode) {
      link = `http://localhost:3000/${slug}`;
    } else {
      link = `https://curiocaster.com/${slug}`;
    }

    console.log(link);
    const el = document.createElement("textarea");
    el.value = link;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    linkCopied = true;
    setTimeout(() => {
      $showShareClip = false;
      linkCopied = false;
    }, 750);
  }
</script>

<section
  class:active={$showShareClip}
  on:mousedown|self={() => ($showShareClip = false)}
  on:touchstart|self={() => ($showShareClip = false)}
>
  <div class="copied-card" out:fade={{ duration: 500 }}>
    {#if linkCopied}
      <p>Episode Copied!</p>
    {:else}
      <button class="copy-button primary" on:click={copyLink}
        >Copy Episode</button
      >
    {/if}
  </div>
</section>

<style>
  section {
    position: fixed;
    top: 0;
    left: 0;
    background-color: hsla(0, 0%, 0%, 0.45);
    height: 100vh;
    width: 100vw;
    display: none;
    place-items: center;
    z-index: 9999;
    backdrop-filter: blur(3px);
  }

  .active {
    display: grid;
  }

  .copied-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--episode-card-color);
    height: 80px;
    width: 320px;
    border-radius: 4px;
    color: var(--primary-text-color);
    position: relative;
    bottom: 150px;
  }

  p {
    font-size: 2.2em;
    font-weight: 700;
    margin: 0;
    padding: 0;

    z-index: 33;
  }

  .copy-button {
    height: 40px;
    margin-top: 8px;
    background-color: var(--secondary-color);
    color: var(--secondary-text-color);
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex: none;
    width: 200px;
    background-color: var(--secondary-color);
    z-index: 33;
    margin: 8px 0;
  }
</style>
