<script>
  import Header from "./Header/Header.svelte";
  import MainScreen from "./MainScreen/MainScreen.svelte";
  import NowPlaying from "./NowPlaying/NowPlaying.svelte";
  import Featured from "./MainScreen/Featured.svelte";
  import Chat from "./Chat/Chat.svelte";

  import PlayList from "$lib/Shared/PlayList/PlayList.svelte";
  import Support from "$lib/Shared/Support/Support.svelte";

  import PlayerDisplay from "./Player/PlayerDisplay.svelte";
  import PlaybackRate from "$lib/Shared/Player/PlaybackRateDesktop.svelte";

  import { currentDesktopView } from "$/stores";

  let showPlaybackRates = false;
</script>

<div
  class="desktop-container"
  on:click={(e) => {
    if (e.target.classList.contains("playbackRateButton")) {
      return;
    }
    showPlaybackRates = false;
  }}
>
  <header>
    <Header />
  </header>

  <div class="main-grid-container">
    <div class="main-screen-grid-container">
      <div
        class="main-screen"
        class:show={$currentDesktopView === "mainScreen"}
      >
        <MainScreen />
      </div>

      <div
        class:show={$currentDesktopView === "nowPlaying"}
        class="now-playing"
      >
        <NowPlaying />
      </div>
      <div class:show={$currentDesktopView === "featured"} class="featured">
        <Featured />
      </div>
      <div class="play-list" class:show={$currentDesktopView === "playList"}>
        <div class="play-list-card">
          <PlayList />
        </div>
      </div>
      <div class="support" class:show={$currentDesktopView === "support"}>
        <Support />
      </div>
      <div class="chat" class:show={$currentDesktopView === "chat"}>
        <Chat />
      </div>
    </div>

    <div class="main-grid-player">
      <PlayerDisplay />
    </div>
    <PlaybackRate bind:showPlaybackRates />
  </div>
</div>

<style>
  .desktop-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: var(--background-color);
    display: flex;
    flex-direction: column;
  }
  div {
    overflow: auto;
  }

  .main-grid-container {
    width: calc(100% - 16px);
    height: calc(100% - 38px);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 108px;
    gap: 0px 0px;
    grid-template-areas:
      "main-screen"
      "player ";
    border-radius: 8px;
    margin: 0 0 4px 8px;
  }

  :global(html[data-theme="dark"] .main-grid-container) {
    width: calc(100%);
    margin: 0;
    border-radius: 0;
  }

  .main-screen-grid-container {
    grid-area: main-screen;
    overflow: hidden;
  }

  .main-grid-player {
    grid-area: player;
    overflow: hidden;
    position: relative;
  }

  .main-screen,
  .now-playing,
  .play-list,
  .support,
  .featured,
  .chat {
    display: none;
    height: 100%;
    width: 100%;
  }

  .play-list {
    height: 100%;

    width: 100%;
  }

  .play-list-card {
    height: calc(100% - 30px);
    overflow: auto;
    width: 750px;
    margin: 15px auto 0 auto;
    overflow: auto;
    background-color: var(--episode-card-color);
    border-radius: 8px;
  }

  .show {
    display: inherit;
  }
</style>
