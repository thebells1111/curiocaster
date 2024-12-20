<script>
  import {
    showPending,
    pendingEpisodeData,
    pendingEpisodesWallet,
  } from "$/stores";
  import PendingEpisode from "./PendingEpisode.svelte";

  function handleCloseModal() {
    $showPending = false;
    $pendingEpisodesWallet = null;
    $pendingEpisodeData = null;
  }
</script>

<section
  class:active={$showPending}
  on:mousedown|self={handleCloseModal}
  on:touchstart|self={handleCloseModal}
>
  <div class="scroll-bar-clipper">
    <PendingEpisode />
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
    place-items: start center;
    z-index: 9999;
    backdrop-filter: blur(3px);
  }

  .active {
    display: grid;
    place-items: center;
  }

  .scroll-bar-clipper {
    width: calc(100% - 16px);
    max-width: 750px;
    height: calc(100% - 64px);
    border-radius: 4px;
    overflow: auto;
    z-index: 3;
    position: relative;
    /* border: var(--modal-border); */
    background-color: var(--primary-color);
    box-shadow: var(--modal-box-shadow);
  }
</style>
