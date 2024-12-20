<script>
  import { playingEpisode, showMobileChat } from "$/stores";
  import WalletControls from "$lib/Shared/NowPlaying/WalletControls.svelte";
  let backLayer = true;

  $: if ($showMobileChat) {
    backLayer = false;
  }
</script>

<div
  class="container"
  class:hide={!$showMobileChat}
  class:back-layer={backLayer}
>
  <p
    on:click={() => {
      $showMobileChat = false;
      setTimeout(() => {
        backLayer = true;
      }, 400);
    }}
  >
    - minimize chat screen -
  </p>
  <iframe src={$playingEpisode?.chat} />

  <div class="boost-container">
    <WalletControls />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    background-color: var(--primary-color);
    z-index: 3;
    opacity: 100%;
    transition: opacity 0.4s;
  }

  p {
    text-align: center;
    padding: 4px 0;
  }

  .boost-container {
    background-color: var(--shownotes-color-dark);
    height: 75px;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    background-color: white;
  }

  .hide {
    opacity: 0;
    transition: opacity 0.4s;
  }

  .back-layer {
    z-index: 0;
  }
</style>
